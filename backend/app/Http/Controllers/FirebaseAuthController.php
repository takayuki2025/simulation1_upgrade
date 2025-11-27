<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Verified;
use App\Models\User;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Auth\IdToken;
use Lcobucci\JWT\Token;
use Throwable;

class FirebaseAuthController extends Controller
{
    // ★修正: メール認証成功後のリダイレクト先を /mypage/profile に戻す
    private const POST_VERIFY_REDIRECT_PATH = '/mypage/profile?verified=true';

    private function getRegistrationName(Request $request, Token $verifiedIdToken, string $email): string
    {
        // 1. Request Input (クライアントから明示的に渡された名前)
        if ($request->filled('name')) {
            Log::info('Name source: Request input.');
            return $request->input('name');
        }
        // 2. Firebase Token Claim
        if ($verifiedIdToken->claims()->has('name')) {
            Log::info('Name source: Firebase Token.');
            return $verifiedIdToken->claims()->get('name');
        }
        // 3. Fallback to Email Local Part (これが上書きの原因となるため、新規登録時や名前が必須の場合のみ利用)
        $parts = explode('@', $email);
        $localPart = $parts[0];
        Log::info('Name source: Fallback to Email Local Part.');
        return $localPart;
    }

    public function registerAndLogin(Request $request)
    {
        Log::info('--- FirebaseAuthController reached (registerAndLogin). ---');

        $request->validate([
            'id_token' => 'required|string',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $idToken = $request->input('id_token');
        $leewayInSeconds = 300;

        $user = null;
        $registerEmail = null;

        try {
            $auth = app(FirebaseAuth::class);
            $verifiedIdToken = $auth->verifyIdToken($idToken, false, $leewayInSeconds);

            $uid = $verifiedIdToken->claims()->get('sub');
            $isEmailVerified = $verifiedIdToken->claims()->get('email_verified', false);
            $emailFromToken = $verifiedIdToken->claims()->get('email');

            $emailFromRequest = $request->input('email');
            $registerEmail = $emailFromToken ?? $emailFromRequest;

            if (empty($registerEmail)) {
                Log::error("Registration failed: Email missing for UID {$uid}.");
                return response()->json(['error' => 'Email is required for registration or login.'], 400);
            }

            $registerName = $this->getRegistrationName($request, $verifiedIdToken, $registerEmail);

            // リクエストにnameが明示的に渡されたかどうかをチェック
            $isNameProvidedInRequest = $request->filled('name');

            // 3. ユーザーの存在確認と処理 (デッドロック自動リトライ付きトランザクション)
            $maxRetries = 5;
            $retryCount = 0;
            $user = null;

            while ($retryCount < $maxRetries) {
                try {
                    $user = DB::transaction(function () use (
                        $uid,
                        $registerEmail,
                        $registerName,
                        $isEmailVerified,
                        $isNameProvidedInRequest // トランザクション内で使用
                    ) {

                        $user = User::where('firebase_uid', $uid)
                                    ->orWhere('email', $registerEmail)
                                    ->lockForUpdate()
                                    ->first();

                        if ($user) {
                            // 既存ユーザーの更新処理
                            if (is_null($user->firebase_uid)) {
                                Log::warning("User found by email ({$registerEmail}) but not by UID. Associating new UID: {$uid}. ID: {$user->id}");
                                $user->firebase_uid = $uid;
                                $user->password = Hash::make($uid);
                            }

                            // ★修正2: 既存ユーザーの場合、リクエストにnameが明示的に渡された場合のみ上書きする
                            if ($isNameProvidedInRequest) {
                                $user->name = $registerName;
                            }

                            if ($isEmailVerified && is_null($user->email_verified_at)) {
                                $user->email_verified_at = now();
                                Log::info("DB email_verified_at updated based on Firebase claim for UID: {$uid}. ID: {$user->id}");
                            }
                            $user->save();

                            if (!$user->hasVerifiedEmail() && !$isEmailVerified) {
                                $user->sendEmailVerificationNotification();
                                Log::info("Verification email re-sent to unverified existing user: {$registerEmail}. ID: {$user->id}");
                            }
                            Log::info("Existing user logged in/updated. UID: {$uid}. ID: {$user->id}");

                            return $user;
                        }

                        // 新規ユーザー作成の試行 (ここでは名前は必ずセット)
                        try {
                            $user = User::create([
                                'name' => $registerName,
                                'email' => $registerEmail,
                                'password' => Hash::make($uid),
                                'firebase_uid' => $uid,
                                'email_verified_at' => $isEmailVerified ? now() : null,
                            ]);

                        } catch (\Illuminate\Database\QueryException $e) {
                            // 重複エラー (Code 23000) が発生した場合
                            if ($e->getCode() === '23000') {
                                Log::warning("New user creation failed due to duplicate email/UID. Attempting to retrieve existing user.");

                                // 別のリクエストが先に作成に成功した可能性を考慮し、ロック付きで再度検索
                                $existingUser = User::where('email', $registerEmail)
                                                    ->orWhere('firebase_uid', $uid)
                                                    ->lockForUpdate()
                                                    ->first();

                                if ($existingUser) {
                                    Log::info("Successfully retrieved user {$existingUser->id} after duplicate creation attempt. Proceeding as existing.");
                                    return $existingUser;
                                }
                            }
                            throw $e;
                        }

                        if (!$isEmailVerified) {
                            $user->sendEmailVerificationNotification();
                            Log::info("Verification email sent to new user: {$registerEmail}");
                        }
                        Log::info("New user registered successfully with UID: {$uid}. ID: {$user->id}");

                        return $user;
                    });

                    break; // トランザクション成功

                } catch (\Illuminate\Database\QueryException $e) {
                    // デッドロックエラー (Code 40001) が発生した場合
                    if ($e->getCode() === '40001' || str_contains($e->getMessage(), 'Deadlock')) {
                        $retryCount++;
                        Log::warning("Deadlock detected. Retrying transaction (Attempt {$retryCount}/{$maxRetries}).");
                        usleep(rand(100000, 500000)); // 待機
                        if ($retryCount >= $maxRetries) {
                            Log::error("Failed to acquire lock after {$maxRetries} attempts. Final Error.");
                            throw $e;
                        }
                        continue;
                    }
                    throw $e; // その他のエラーはそのままスロー
                }
            }

            if (!$user) {
                Log::error("Authentication failed: User object could not be resolved after all retries.");
                return response()->json(['error' => 'Authentication failed due to a server synchronization issue.'], 503);
            }

            // 4. Sanctumトークンの生成
            $user->tokens()->delete();
            $token = $user->createToken('authToken')->plainTextToken;
            Log::info("Sanctum token issued for user ID: {$user->id}");

            // 5. JSONレスポンスを返す
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'uid' => $user->firebase_uid,
                'email_verified_at' => $user->email_verified_at,
                'post_number' => $user->post_number,
                'address' => $user->address,
                'building' => $user->building,
                'user_image' => $user->user_image,
            ];

            return response()->json([
                'token' => $token,
                'user' => $userData,
            ], 200);

        } catch (\Kreait\Firebase\Exception\Auth\InvalidToken $e) {
            Log::error("Firebase Invalid ID Token: " . $e->getMessage());
            return response()->json(['error' => 'Invalid Firebase ID Token.'], 401);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error("Final DB Critical Error: " . $e->getMessage() . " Code: {$e->getCode()}");
            return response()->json(['error' => 'Authentication failed due to a critical server synchronization issue.'], 503);
        } catch (Throwable $e) {
            Log::error("Auth/Register Critical Error: " . $e->getMessage() . " Trace: " . $e->getTraceAsString());
            return response()->json(['error' => 'Server authentication failed.', 'details' => 'Internal Server Error.'], 500);
        }
    }

    public function handleTokenExchange(Request $request)
    {
        Log::info('--- FirebaseAuthController reached (handleTokenExchange). Forwarding to registerAndLogin. ---');
        return $this->registerAndLogin($request);
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        Log::info('--- VERIFY EMAIL METHOD STARTED ---');
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

        if (! $request->hasValidSignature()) {
            Log::error('Email verification failed: Invalid signature.');
            return redirect("{$frontendUrl}/login?error=verification_failed&reason=invalid_signature");
        }

        $user = User::find($id);

        if (is_null($user)) {
            Log::error('Email verification failed: User ID not found.', ['user_id' => $id, 'hash' => $hash]);
            return redirect("{$frontendUrl}/login?error=verification_failed&reason=not_found");
        }

        if (empty($user->getEmailForVerification()) || ! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            Log::warning('Email verification failed: Invalid hash or missing email.', ['user_id' => $id, 'provided_hash' => $hash]);
            return redirect("{$frontendUrl}/login?error=verification_failed&reason=invalid_hash");
        }

        if ($user->hasVerifiedEmail()) {
            Log::info('User already verified. Redirecting to success page.', ['user_id' => $user->id]);
            // 既に認証済みの場合は、修正後のパスへリダイレクト
            return redirect("{$frontendUrl}" . self::POST_VERIFY_REDIRECT_PATH);
        }

        if ($user->markEmailAsVerified()) {
            $user->refresh();
            event(new Verified($user));
            Log::info('Laravel DB email verified successfully (User Model Check).', ['user_id' => $user->id, 'verified_at' => $user->email_verified_at]);

            try {
                if ($user->firebase_uid) {
                    $auth = app(FirebaseAuth::class);
                    $auth->updateUser($user->firebase_uid, [
                        'emailVerified' => true,
                    ]);
                    Log::info('Firebase email verification status updated for UID: ' . $user->firebase_uid);
                } else {
                    Log::warning('Firebase UID missing for user. Skipping Firebase status update.', ['user_id' => $user->id]);
                }
            } catch (Throwable $e) {
                Log::error('Failed to update Firebase email verification status for UID: ' . $user->firebase_uid . ' Error: ' . $e->getMessage());
            }
        } else {
            Log::error('CRITICAL: markEmailAsVerified failed to save to database.', ['user_id' => $user->id]);
            return redirect("{$frontendUrl}/login?error=verification_failed&reason=save_error");
        }

        // 認証成功後は、修正後のパスへリダイレクト
        return redirect(
            "{$frontendUrl}" . self::POST_VERIFY_REDIRECT_PATH
        );
    }
}

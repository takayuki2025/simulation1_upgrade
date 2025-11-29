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

    // ★追加: メール認証失敗時のリダイレクト先（フロントエンドのルート）
    private const VERIFICATION_FAILURE_REDIRECT_PATH = '/login?error=verification_failed';

    /**
     * 登録・ログイン時に使用する名前を決定する。
     * 優先度: 1. Request入力(ユーザー記入名) -> 2. Firebaseクレーム -> 3. メールアドレスのローカルパート -> 4. Firebase UIDの一部
     * * @param Request $request
     * @param Token $verifiedIdToken
     * @param string $email
     * @param string $uid Firebase User ID
     * @return string 常に非nullの文字列を返すようにロジックを変更
     */
    private function getRegistrationName(Request $request, Token $verifiedIdToken, string $email, string $uid): string
    {
        // 1. Request Input (クライアントから明示的に渡された名前 - ユーザー記入名) を最優先
        if ($request->filled('name')) {
            $name = $request->input('name');
            if (!empty($name)) {
                Log::info('Name source: Request input (User entered).');
                return $name;
            }
        }

        // 2. Firebase Token Claim
        if ($verifiedIdToken->claims()->has('name')) {
            $name = $verifiedIdToken->claims()->get('name');
            if (!empty($name)) {
                Log::info('Name source: Firebase Token.');
                return $name;
            }
        }

        // 3. メールアドレスのローカルパート (フォールバック 1)
        if (!empty($email) && str_contains($email, '@')) {
            $parts = explode('@', $email, 2);
            $localPart = $parts[0];
            if (!empty($localPart)) {
                // メールアドレス形式の特殊文字を削除し、簡潔にする
                $safeName = preg_replace('/[^a-zA-Z0-9_.]/', '', $localPart);
                if (!empty($safeName)) {
                    Log::info('Name source: Email local part (Fallback).');
                    return $safeName;
                }
            }
        }

        // 4. ★追加: Firebase UIDの一部を最後のフォールバックとする (空欄防止の根本解決)
        $uidPrefix = 'User-' . substr($uid, 0, 8);
        Log::warning('Name source: All sources failed. Using Firebase UID prefix as fallback: ' . $uidPrefix);
        return $uidPrefix; // 常に何かを返す

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
        // ★追加: ログイン後のメール認証状態を保持するフラグ
        $needsVerification = false;

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

            // ★修正: getRegistrationNameに$uidを渡す (返り値は常にstringになった)
            $registerName = $this->getRegistrationName($request, $verifiedIdToken, $registerEmail, $uid);

            // リクエストにnameが明示的に渡されたかどうかをチェック (Firebase Tokenの名前はここでは含まない)
            $isNameProvidedInRequest = $request->filled('name');
            // Firebaseクレームに名前が含まれていたか、またはリクエストに含まれていたか (未使用だが以前のロジックのために保持)
            $isAnyNameProvided = !empty($registerName); // 空文字列は返されないため、常にtrueに近い


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
                        $isNameProvidedInRequest, // ★追加: ユーザー記入名の有無をトランザクションに渡す
                        $isAnyNameProvided
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

                            // ★修正2: 既存ユーザーの場合、リクエストにnameが明示的に渡された場合（ユーザー記入名）のみ上書きする
                            // Firebaseクレーム由来の名前では、DB上の既存の名前を上書きしないようにする。
                            if ($isNameProvidedInRequest) {
                                $user->name = $registerName; // $registerNameはRequestからの値
                            }


                            if ($isEmailVerified && is_null($user->email_verified_at)) {
                                $user->email_verified_at = now();
                                Log::info("DB email_verified_at updated based on Firebase claim for UID: {$uid}. ID: {$user->id}");
                            }
                            $user->save();

                            // ★修正3: ユーザーが未認証の場合にのみ通知を再送
                            if (is_null($user->email_verified_at)) {
                                $user->sendEmailVerificationNotification();
                                Log::info("Verification email re-sent to unverified existing user: {$registerEmail}. ID: {$user->id}");
                                // ★フラグをセット
                                global $needsVerification;
                                $needsVerification = true;
                            }
                            Log::info("Existing user logged in/updated. UID: {$uid}. ID: {$user->id}");

                            return $user;
                        }

                        // 新規ユーザー作成の試行
                        try {
                            // ★修正: getRegistrationNameが常に非空文字列を返すようになったため、$registerName ?? '' を $registerName に変更
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
                            throw $e; // その他のエラー、または重複ユーザーが取得できなかった場合はスロー
                        }

                        // ★修正4: 新規ユーザーでメールが未認証の場合にのみ通知を送信
                        if (is_null($user->email_verified_at)) {
                            $user->sendEmailVerificationNotification();
                            Log::info("Verification email sent to new user: {$registerEmail}");
                            // ★フラグをセット
                            global $needsVerification;
                            $needsVerification = true;
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

            // ★修正5: トランザクション外部でメール認証状態を再チェックし、フラグを確定
            if ($user && is_null($user->email_verified_at)) {
                $needsVerification = true;
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

            // ★修正6: メール認証が必要な場合にフラグをセットして返す
            return response()->json([
                'token' => $token,
                'user' => $userData,
                'needs_email_verification' => $needsVerification,
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
        // ★微調整: ルート名の変更をログに反映
        Log::info('--- FirebaseAuthController reached (handleTokenExchange) via /api/login_or_register. Forwarding to registerAndLogin. ---');
        return $this->registerAndLogin($request);
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        Log::info('--- VERIFY EMAIL METHOD STARTED ---');
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

        if (! $request->hasValidSignature()) {
            Log::error('Email verification failed: Invalid signature.');
            // ★修正1-1: 認証失敗時のリダイレクト先を修正
            return redirect("{$frontendUrl}" . self::VERIFICATION_FAILURE_REDIRECT_PATH . "&reason=invalid_signature");
        }

        $user = User::find($id);

        if (is_null($user)) {
            Log::error('Email verification failed: User ID not found.', ['user_id' => $id, 'hash' => $hash]);
            // ★修正1-2: 認証失敗時のリダイレクト先を修正
            return redirect("{$frontendUrl}" . self::VERIFICATION_FAILURE_REDIRECT_PATH . "&reason=not_found");
        }

        // ... (ハッシュチェックは省略) ...

        if ($user->hasVerifiedEmail()) {
            Log::info('User already verified. Redirecting to success page.', ['user_id' => $user->id]);
            // 既に認証済みの場合は、既存のトークンを使いリダイレクトさせるために、下のトークン生成ロジックへ流します
        }

        $newAuthToken = null;
        if (! $user->hasVerifiedEmail()) {
            if ($user->markEmailAsVerified()) {
                // DB更新の直後: 安定化のため必ずリフレッシュ
                $user->refresh();
                event(new Verified($user));
                Log::info('Laravel DB email verified successfully (User Model Check).', ['user_id' => $user->id, 'verified_at' => $user->email_verified_at]);

                // ★★★ 根本解決 1: Sanctum トークンの再生成 ★★★
                // 古いトークンを削除し、新しいトークンを生成
                $user->tokens()->delete();
                $newAuthToken = $user->createToken('authToken')->plainTextToken;
                Log::info('New Sanctum token issued after email verification for user ID: ' . $user->id);
                // ★★★ 修正箇所 終わり ★★★

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
                // ★修正1-3: 認証失敗時のリダイレクト先を修正
                return redirect("{$frontendUrl}" . self::VERIFICATION_FAILURE_REDIRECT_PATH . "&reason=save_error");
            }
        }

        // 既に認証済みの場合、またはトークン生成に成功した場合
        if (!$newAuthToken) {
            // 既に認証済みでトークンがない場合、一時的にトークンを生成（セッション維持のため）
            $user->tokens()->delete();
            $newAuthToken = $user->createToken('authToken')->plainTextToken;
        }


        // 認証成功後は、トークンを付与してリダイレクト
        return redirect(
            "{$frontendUrl}" . self::POST_VERIFY_REDIRECT_PATH . "?token={$newAuthToken}&verified=true"
        );
    }
}

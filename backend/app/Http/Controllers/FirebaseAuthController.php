<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use App\Models\User;
use Throwable;
// ★ メール認証に必要なクラスをインポート
use Illuminate\Auth\Events\Verified; 
use Illuminate\Auth\Notifications\VerifyEmail; 

class FirebaseAuthController extends Controller 
{
    /**
     * Firebase IDトークンを使用してユーザーを登録またはログインし、Sanctumトークンを返す
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function registerAndLogin(Request $request)
    {
        Log::info('--- FirebaseAuthController reached. ---');

        // 1. バリデーション
        $request->validate([
            'id_token' => 'required|string',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $idToken = $request->input('id_token');
        
        // ★ 修正点: SDKのシグネチャに合わせて、許容誤差 (leeway) を整数として定義
        // クライアントの時刻ずれを吸収するため、300秒（5分）を設定します。
        $leewayInSeconds = 300; 

        try {
            Log::info('DEBUG: Start Firebase Auth instance acquisition.');

            $auth = app(FirebaseAuth::class); 

            Log::info('DEBUG: Firebase Auth instance acquired. Start ID Token verification.');

            // IDトークンを検証
            // ★ 修正点:
            //   - 第2引数 ($checkIfRevoked) は false (boolean)
            //   - 第3引数 ($leewayInSeconds) は $leewayInSeconds (int)
            $verifiedIdToken = $auth->verifyIdToken($idToken, false, $leewayInSeconds);
            
            Log::info('DEBUG: ID Token successfully verified.');
            
            $uid = $verifiedIdToken->claims()->get('sub');
            $isEmailVerified = $verifiedIdToken->claims()->get('email_verified', false); 
            $emailFromToken = $verifiedIdToken->claims()->get('email');
            
            // 2. ユーザーの存在確認 (Firebase UIDで)
            $user = User::where('firebase_uid', $uid)->first();

            // 3. ユーザー処理
            if (!$user) {
                // ---------------------
                // ★ 新規登録処理 / メール重複時の紐付け処理 ★
                // ---------------------
                $nameFromRequest = $request->input('name'); 
                $emailFromRequest = $request->input('email'); 
                $nameFromToken = $verifiedIdToken->claims()->get('name'); // ★ 追記: Firebaseトークンに含まれる名前を取得

                $registerEmail = $emailFromToken ?? $emailFromRequest;
                
                // ★★★ 修正・改善箇所：名前の決定ロジックを優先順位に基づいて変更 ★★★
                $registerName = null;

                if (!empty($nameFromRequest)) {
                    // 1. Requestで送られてきた名前を最優先
                    $registerName = $nameFromRequest;
                    Log::info('Name source: Request input.');
                } elseif (!empty($nameFromToken)) {
                    // 2. Requestの名前が空の場合、Firebaseトークンの表示名を使用
                    $registerName = $nameFromToken;
                    Log::info('Name source: Firebase Token.');
                } elseif (!empty($registerEmail)) {
                    // 3. どちらも空の場合、メールアドレスのローカルパートを最終手段として使用
                    $localPart = explode('@', $registerEmail)[0];
                    $registerName = $localPart;
                    Log::warning('Name source: Fallback to Email Local Part.');
                } else {
                     // どのソースからも名前が取得できない場合
                     $registerName = null;
                }
                // ★★★ 修正箇所ここまで ★★★
                
                // データベースの制約に合わせて name の長さを制限する (既存のロジックを維持)
                $maxLength = 30; // usersテーブルのnameカラムの最大長に合わせて調整
                if (!empty($registerName) && mb_strlen($registerName) > $maxLength) {
                    $registerName = mb_substr($registerName, 0, $maxLength);
                    Log::warning("Name was truncated to {$maxLength} characters to fit database schema.");
                }
                
                // 登録に必要な最終チェック
                if (empty($registerName) || empty($registerEmail)) {
                    Log::error("Registration attempt failed: Name/Email missing from all sources for UID {$uid}.");
                    return response()->json(['error' => 'User not found in database and name/email are required for registration.'], 400);
                }

                // メールアドレス重複チェック (1回目)
                $user = User::where('email', $registerEmail)->first();

                if ($user) {
                    // ユーザーがメールアドレスで既に存在する場合 (1回目のチェックで検出)
                    Log::warning("User already exists by email: {$registerEmail}. Associating new Firebase UID: {$uid}");
                    
                    // 既存ユーザーのFirebase UIDを更新してログインを続行
                    $user->firebase_uid = $uid;
                    // パスワードもFirebase UIDのハッシュに更新（ログインパスワードが不要な運用を想定）
                    $user->password = Hash::make($uid); 
                    $user->save();
                    
                } else {
                    // ユーザーがDBに存在しない場合、新規登録を実行
                    try {
                        $user = DB::transaction(function () use ($uid, $registerName, $registerEmail, $isEmailVerified) {
                            $newUser = User::create([
                                'name' => $registerName, 
                                'email' => $registerEmail,
                                'password' => Hash::make($uid),
                                'firebase_uid' => $uid,
                                'email_verified_at' => $isEmailVerified ? now() : null,
                            ]);
        
                            if (!$isEmailVerified) {
                                $newUser->sendEmailVerificationNotification();
                            }
        
                            return $newUser;
                        });
                        Log::info("New user registered successfully with UID: {$uid}. Name used: {$registerName}");
                        
                    } catch (\Illuminate\Database\QueryException $e) {
                        // 新規登録失敗時のフォールバック処理 (既存のロジックを維持)
                        if ($e->getCode() === '23000') {
                            Log::warning("Attempted registration failed due to Duplicate Entry, falling back to association check: {$registerEmail}");
                            
                            // 2回目のメール検索で既存ユーザーを取得
                            $user = User::where('email', $registerEmail)->first();
                            
                            if ($user) {
                                // 紐付け処理を続行
                                $user->firebase_uid = $uid;
                                $user->password = Hash::make($uid); 
                                $user->save();
                                Log::info("Successfully associated existing user by email ({$registerEmail}) after failed insert.");
                            } else {
                                Log::error("Critical Error: Duplicate entry detected but user not found on second check.");
                                throw $e;
                            }
                        } else {
                            // その他のQueryExceptionはそのままスロー
                            throw $e;
                        }
                    }
                }

            } else {
                // ---------------------
                // ★ 既存ユーザーのログイン処理 (UIDで発見) ★
                // ---------------------
                Log::info("Existing user logged in with UID: {$uid}");
                
                // Firebaseクレームを元にDBの検証ステータスを更新
                if (($isEmailVerified && is_null($user->email_verified_at)) || (!$isEmailVerified && !is_null($user->email_verified_at))) {
                    $user->email_verified_at = $isEmailVerified ? now() : null;
                    $user->save();
                    Log::info("User email verification status updated based on Firebase claims.");
                }
            }
            
            Log::info('DEBUG: User check/registration completed successfully.');


            // 4. Sanctumトークンの生成
            if (!$user) {
                Log::error("Authentication failed: User object is null after all registration/login attempts.");
                return response()->json(['error' => 'Authentication process failed unexpectedly.'], 500);
            }
            
            // ★ 削除推奨行 1: ユーザーモデルの再ロード（Auth::loginのため不要）
            // $user = User::find($user->id); 
            
            if (!$user) {
                Log::error("Authentication failed: User not found in database after successful Firebase verification.");
                return response()->json(['error' => 'Authentication process failed unexpectedly.'], 500);
            }
            Log::info('DEBUG: User model reloaded from database (User::find) to ensure latest verification status.'); // ★ ログも削除対象
            
            // ★ 削除必須行 2: Laravelセッション（Cookie）への強制ログイン処理
            // Auth::login($user); 
            // Log::info('DEBUG: User successfully logged into web guard session using Auth::login.'); // ★ ログも削除対象

            $user->tokens()->delete();
            Log::info('DEBUG: Old tokens deleted.');
            
            $token = $user->createToken('authToken')->plainTextToken;
            Log::info('DEBUG: New Sanctum token created.');

            // 5. JSONレスポンスを返す
            Log::info('Returning user data (Sanctum/Firebase):', [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'uid' => $user->firebase_uid, 
                'email_verified_at' => $user->email_verified_at,
            ]);
            
            Log::info('DEBUG: Preparing final JSON response.');

            return response()->json([
                'token' => $token,
                'user' => [ 
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'uid' => $user->firebase_uid, 
                    'email_verified_at' => $user->email_verified_at,
                ], 
            ], 200);

        } catch (\Kreait\Firebase\Exception\Auth\InvalidToken $e) {
            // "The token was issued in the future" のエラーはここで許容誤差によって吸収されます。
            Log::error("Firebase Invalid ID Token: " . $e->getMessage());
            return response()->json(['error' => 'Invalid Firebase ID Token.'], 401);
        } catch (Throwable $e) {
            Log::error("Auth/Register Error: " . $e->getMessage());
            return response()->json(['error' => 'Server authentication failed.', 'details' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
        }
    }

    /**
     * メール認証リンクをクリックした後の処理 (Laravel Fortify の動作を模倣)
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verifyEmail(Request $request, $id, $hash)
    {
        Log::info('--- VERIFY EMAIL METHOD STARTED ---'); // ★これを入れてログに表示されるか確認
        // フロントエンドURLを安全に取得（末尾のスラッシュを削除）
        // $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
        $frontendUrl = rtrim(env('FRONTEND_URL', 'https://laravel.test:4430'), '/'); // ★ 修正: Nuxtのポート番号を明示的に4430に設定（またはenvから取得）

        // 1. IDを使ってユーザーを直接検索
        $user = User::find($id);

        if (is_null($user)) {
            Log::error('Email verification failed: User ID not found.', ['user_id' => $id, 'hash' => $hash]);
            // フロントエンドのログインページにリダイレクトし、エラーを通知
            return redirect("{$frontendUrl}/login?error=verification_failed&reason=not_found");
        }
        
        // 2. URLのハッシュが有効かチェック
        // ハッシュチェックの前に、ユーザーがメールアドレスを持っているか確認 (getEmailForVerification()がnullを返す可能性に備える)
        if (empty($user->getEmailForVerification()) || ! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            Log::warning('Email verification failed: Invalid hash or missing email.', ['user_id' => $id, 'provided_hash' => $hash]);
            return redirect("{$frontendUrl}/login?error=verification_failed&reason=invalid_hash");
        }

        // 3. 認証済みかチェック
        if ($user->hasVerifiedEmail()) {
            // 既に検証済みの場合、認証完了後のページにリダイレクト
            return redirect("{$frontendUrl}/mypage/profile?verified=true&reason=already_verified");
        }

        // 4. Laravelデータベース側でメールを検証済みとしてマーク
        if ($user->markEmailAsVerified()) {
            // markEmailAsVerified() の後に、念のためユーザーインスタンスをリフレッシュ
            $user->refresh(); 

            event(new Verified($user));
            Log::info('Laravel DB email verified successfully (User Model Check).', ['user_id' => $user->id, 'verified_at' => $user->email_verified_at]); 
            
            // 5. Firebaseのメール認証ステータスも更新
            try {
                // FirebaseのUIDがない場合は更新をスキップ
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
                // Firebaseの更新はオプションであり、致命的なエラーではない
                Log::error('Failed to update Firebase email verification status for UID: ' . $user->firebase_uid . ' Error: ' . $e->getMessage());
            }
        } else {
            // markEmailAsVerified()がfalseを返した場合（保存に失敗した場合）のログを追加
            Log::error('CRITICAL: markEmailAsVerified failed to save to database.', ['user_id' => $user->id]);
            return redirect("{$frontendUrl}/login?error=verification_failed&reason=save_error");
        }
        
        // 6. 認証完了後のリダイレクト
        return redirect("{$frontendUrl}/mypage/profile?verified=true");
    }
}
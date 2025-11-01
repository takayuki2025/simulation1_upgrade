<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use App\Models\User;
use Throwable;
// ★ 追加: メール認証に必要なクラスをインポート
use Illuminate\Auth\Events\Verified; 
// ★ 追加: Email VerificationをディスパッチするためにNotificationクラスもインポート
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
            'email' => 'required|email|max:255',
        ]);

        $idToken = $request->input('id_token');
        $name = $request->input('name');
        $email = $request->input('email');
        
        try {
            // ★ 修正ポイント: メソッド内でFirebase Authインスタンスを安全に取得
            $auth = app(FirebaseAuth::class); 

            // IDトークンを検証
            $verifiedIdToken = $auth->verifyIdToken($idToken); // ★ $this->auth から $auth に変更
            $uid = $verifiedIdToken->claims()->get('sub');
            // 💡 修正点 1: Firebaseクレームからメール認証ステータスを取得
            $isEmailVerified = $verifiedIdToken->claims()->get('email_verified'); 

            // 2. ユーザーの存在確認
            $user = User::where('firebase_uid', $uid)->first();

            // 3. ユーザー処理
            if (!$user) {
                // ---------------------
                // ★ 新規登録処理 ★
                // ---------------------
                if (empty($name)) {
                    Log::error("Registration attempt failed: Name is missing for new user UID {$uid}.");
                    return response()->json(['error' => 'User not found in database and name is required for registration.'], 400);
                }

                // 💡 修正点 2: クロージャに $isEmailVerified を渡す
                $user = DB::transaction(function () use ($uid, $name, $email, $isEmailVerified) {
                    $newUser = User::create([
                        'name' => $name,
                        'email' => $email,
                        'password' => Hash::make($uid),
                        'firebase_uid' => $uid,
                        // 💡 修正点 3: Firebaseの認証ステータスに基づいて値を設定
                        'email_verified_at' => $isEmailVerified ? now() : null,
                    ]);

                    // 修正点 7: Firebase側で未認証の場合、Laravelから認証メールを送信する
                    if (!$isEmailVerified) {
                        $newUser->sendEmailVerificationNotification();
                        Log::info("Verification email dispatched for new user: {$email}");
                    }

                    return $newUser;
                });
                Log::info("New user registered successfully with UID: {$uid}");

            } else {
                // ---------------------
                // ★ 既存ユーザーのログイン処理 ★
                // ---------------------
                Log::info("Existing user logged in with UID: {$uid}");
                
                // 💡 修正点 4: 既存ユーザーも Firebase の最新の認証状態に同期させる
                if (($isEmailVerified && is_null($user->email_verified_at)) || (!$isEmailVerified && !is_null($user->email_verified_at))) {
                    $user->email_verified_at = $isEmailVerified ? now() : null;
                    $user->save();
                    Log::info("User email verification status updated based on Firebase claims.");
                }
            }

            // 4. Sanctumトークンの生成
            $user->tokens()->delete();
            $token = $user->createToken('authToken')->plainTextToken;

            // 5. JSONレスポンスを返す
            Log::info('Returning user data (Sanctum/Firebase):', [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'uid' => $user->firebase_uid, 
                // email_verified_at もログに出すとデバッグに役立ちます
            ]);

            // 💡 修正点 5: フロントエンドが期待する user オブジェクトに email_verified_at を含める
            return response()->json([
                'token' => $token,
                'user' => [ 
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'uid' => $user->firebase_uid, 
                    'email_verified_at' => $user->email_verified_at, // ★ 認証ステータスを必ず含める
                ], 
            ], 200);

        } catch (\Kreait\Firebase\Exception\Auth\InvalidToken $e) {
            Log::error("Firebase Invalid ID Token: " . $e->getMessage());
            return response()->json(['error' => 'Invalid Firebase ID Token.'], 401);
        } catch (Throwable $e) {
            // 致命的なエラーもこれで捕捉できるようになります
            Log::error("Auth/Register Error: " . $e->getMessage());
            return response()->json(['error' => 'Server authentication failed.', 'details' => $e->getMessage()], 500);
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
        // 1. IDを使ってユーザーを直接検索
        $user = User::find($id);

        if (is_null($user)) {
            Log::error('Email verification failed: User ID not found.', ['user_id' => $id, 'hash' => $hash]);
            return redirect(env('FRONTEND_URL') . '/login?error=verification_failed_not_found');
        }
        
        // 2. URLのハッシュが有効かチェック
        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            Log::warning('Email verification failed: Invalid hash.', ['user_id' => $id, 'provided_hash' => $hash]);
            return redirect(env('FRONTEND_URL') . '/login?error=verification_failed_invalid_hash');
        }

        // 3. 認証済みかチェック
        if ($user->hasVerifiedEmail()) {
            return redirect(env('FRONTEND_URL') . '/mypage/profile?verified=true');
        }

        // 4. Laravelデータベース側でメールを検証済みとしてマーク
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
            Log::info('Laravel DB email verified successfully.', ['user_id' => $user->id]);

            // 5. Firebaseのメール認証ステータスも更新
            try {
                // メソッド内でFirebase Authインスタンスを安全に取得
                $auth = app(FirebaseAuth::class); 

                // Firebase側もメール認証済みに設定 (ユーザーが持つuidを使用)
                $auth->updateUser($user->firebase_uid, [ // ★ $user->uid ではなく $user->firebase_uid の方が安全
                    'emailVerified' => true,
                ]);
                Log::info('Firebase email verification status updated for UID: ' . $user->firebase_uid);
            } catch (Throwable $e) {
                // エラーが発生しても処理は続行
                Log::error('Failed to update Firebase email verification status for UID: ' . $user->firebase_uid . ' Error: ' . $e->getMessage());
            }
        }
        
        // 6. 認証完了後のリダイレクト
        return redirect(env('FRONTEND_URL') . '/mypage/profile?verified=true');
    }
}
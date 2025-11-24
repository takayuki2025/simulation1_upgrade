<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Throwable;

class VerifyFirebaseToken
{
    protected $firebaseAuth;

    public function __construct(FirebaseAuth $firebaseAuth)
    {
        $this->firebaseAuth = $firebaseAuth;
    }

    public function handle(Request $request, Closure $next): Response
    {
        Log::info("VERIFY_MIDDLEWARE_EXECUTED_CHECK: Middleware started.");
        
        // 1. トークンの取得 (Authorizationヘッダー または カスタムヘッダー)
        $token = $request->bearerToken();

        // Bearerトークンが取れない場合、カスタムヘッダーをチェック
        if (!$token) {
            $token = $request->header('X-Firebase-Token');
            if ($token) {
                // Log::info('VerifyFirebaseToken: Token retrieved from X-Firebase-Token header.'); // Log removed to prevent repetition
            }
        }
        
        // ログ出力 (デバッグ用)
        Log::info('VERIFY_HEADER_DUMP: Authorization header: ' . ($token ? 'Bearer (token present)' : 'N/A'));
        
        // トークンがない場合はゲストとして続行
        if (!$token) {
            Log::info("VerifyFirebaseToken: Token Status: MISSING (Proceeding as guest)");
            return $next($request);
        }

        try {
            Log::info("VerifyFirebaseToken: Token Status: PRESENT (Verification started)");
            
            // トークン検証 (300秒の猶予)
            $decodedToken = $this->firebaseAuth->verifyIdToken($token, false, 300);
            
            Log::info("VerifyFirebaseToken: TOKEN VERIFIED. Proceeding to DB lookup.");

            // UIDとメタデータの取得
            // Firebase ID Tokenでは 'sub' または 'user_id' がUIDとして使われます
            $uid = $decodedToken->claims()->get('sub') ?? $decodedToken->claims()->get('user_id'); 
            $email = $decodedToken->claims()->get('email');
            $name = $decodedToken->claims()->get('name') ?? 'User-' . substr($uid, 0, 8);
            
            // サインインプロバイダーをチェック
            $providerId = $decodedToken->claims()->get('firebase')['sign_in_provider'] ?? null;

            // 匿名ユーザーの場合は、認証は行わず、ゲストとして続行
            if ($providerId === 'anonymous') {
                Log::info("VerifyFirebaseToken: Anonymous provider detected (UID: {$uid}). Proceeding as guest.");
                return $next($request); 
            }
            
            Log::info("VerifyFirebaseToken: Token successfully verified. UID: {$uid}");

            // ローカルDBからユーザーを検索
            $user = User::where('firebase_uid', $uid)->first();

            // Just-In-Time Provisioning
            if (!$user) {
                Log::warning("User not found in database for Firebase UID: {$uid}. Starting Just-In-Time Provisioning.");

                // メールアドレスが必須だが匿名ではない場合は、プロビジョニングを試みる
                if ($email) {
                    $user = User::create([
                        'firebase_uid' => $uid,
                        'name' => $name,
                        'email' => $email,
                        'password' => Hash::make(base64_encode(random_bytes(10))), // ダミーパスワード
                        'email_verified_at' => $decodedToken->claims()->get('email_verified') ? now() : null,
                    ]);
                    Log::info("VerifyFirebaseToken: New user provisioned. ID: {$user->id}");
                } else {
                    // Firebase AuthだがEmailがない場合（電話番号認証など）
                    Log::error("VerifyFirebaseToken: Cannot provision user (UID: {$uid}) due to missing required 'email' field. Proceeding as guest.");
                    return $next($request);
                }
            }
            
            // 認証の実行
            if ($user) {
                Auth::login($user);
                Log::info("VerifyFirebaseToken: AUTH SUCCESS. User attached. {\"user_id\":{$user->id}}");
            } else {
                Log::error("VerifyFirebaseToken: User object not available after JIT. Proceeding as guest.");
            }

        } catch (\Kreait\Firebase\Exception\Auth\InvalidToken $e) {
            Log::error('VerifyFirebaseToken: Invalid Token. Proceeding as guest. ' . $e->getMessage());
        } catch (Throwable $e) {
            Log::error('VerifyFirebaseToken: General Error. Proceeding as guest. ' . json_encode(['message' => $e->getMessage()]));
        }
        
        // ログによる最終チェック
        $authCheck = Auth::check();
        $requestUser = Auth::user() ? Auth::user()->id : 'N/A';
        // SanctumCheckは不要なので削除
        Log::info("VerifyFirebaseToken: FINAL CHECK: Auth::check()=" . ($authCheck ? 'TRUE' : 'FALSE') . ", RequestUser={$requestUser}");

        return $next($request);
    }
}
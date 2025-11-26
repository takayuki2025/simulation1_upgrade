<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str; // Strファサードを追加
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

        // 🔥 1. トークンの取得ロジックを強化 🔥
        // $request->bearerToken() ではなく、生のAuthorizationヘッダーを取得
        $authorizationHeader = $request->header('Authorization');
        $idToken = null;

        // Authorizationヘッダーがない場合、カスタムヘッダーをチェック
        if (!$authorizationHeader) {
            $authorizationHeader = $request->header('X-Firebase-Token');
        }

        // ログ出力 (デバッグ用: 生のヘッダー値を確認)
        Log::info('VERIFY_HEADER_DUMP: Raw Authorization Header: ' . ($authorizationHeader ?? 'N/A'));

        // Bearerスキームの処理 (スペースの有無に対応)
        if (is_string($authorizationHeader)) {
            // "Bearer " (スペースあり) の標準形式
            if (Str::startsWith($authorizationHeader, 'Bearer ')) {
                $idToken = Str::substr($authorizationHeader, 7);
            } 
            // cURLテストで確認された "BearereyJ..." の形式 (スペースなし)
            elseif (Str::startsWith($authorizationHeader, 'Bearer')) {
                $idToken = Str::substr($authorizationHeader, 6);
            }
        }

        // ログ出力 (デバッグ用: 抽出されたトークンを確認)
        Log::info('VERIFY_TOKEN_EXTRACTED: Extracted Token Status: ' . ($idToken ? 'SUCCESS (Token starts with: ' . substr($idToken, 0, 10) . '...)' : 'FAILED/N/A'));


        // --- 💡 トークンがない場合 ---
        if (!$idToken) {
            Log::info("VerifyFirebaseToken: Token Status: MISSING (Passing as unauthenticated).");
            // トークンがない場合は、次のミドルウェアへ進む
            return $next($request);
        }
        // ------------------------------------------------------------------------------------------------

        try {
            Log::info("VerifyFirebaseToken: Token Status: PRESENT (Verification started)");

            // トークン検証 (300秒の猶予)
            $decodedToken = $this->firebaseAuth->verifyIdToken($idToken, false, 300); // 抽出した $idToken を使用

            Log::info("VerifyFirebaseToken: TOKEN VERIFIED. Proceeding to DB lookup.");

            // UIDとメタデータの取得
            $uid = $decodedToken->claims()->get('sub') ?? $decodedToken->claims()->get('user_id');
            $email = $decodedToken->claims()->get('email');
            $name = $decodedToken->claims()->get('name') ?? 'User-' . substr($uid, 0, 8);

            Log::info("VerifyFirebaseToken: Decoded Token Payload. UID: {$uid}, Email: {$email}");

            // サインインプロバイダーをチェック
            $providerId = $decodedToken->claims()->get('firebase')['sign_in_provider'] ?? null;

            // 匿名ユーザーの場合は、401を返す (API保護のため)
            if ($providerId === 'anonymous') {
                Log::warning("VerifyFirebaseToken: Anonymous provider detected (UID: {$uid}). Unauthorized.");
                return response()->json(['message' => 'Unauthenticated: Anonymous users cannot access this resource.'], 401); 
            }

            // ローカルDBからユーザーを検索
            $user = User::where('firebase_uid', $uid)->first();

            // Just-In-Time Provisioning
            if (!$user) {
                Log::warning("VerifyFirebaseToken: User not found. Starting JIT Provisioning.");
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
                    Log::error("VerifyFirebaseToken: Cannot provision user (UID: {$uid}) due to missing required 'email'. Unauthorized.");
                    return response()->json(['message' => 'Unauthenticated: User creation failed due to missing email.'], 401);
                }
            } else {
                Log::info("VerifyFirebaseToken: Existing user found. ID: {$user->id}");
            }

            // 認証の実行
            if ($user) {
                // Sanctumガードにユーザーを設定
                Auth::guard('sanctum')->setUser($user);

                // デフォルトガードにもユーザーを設定 (auth:sanctumの動作安定化のため)
                Auth::setUser($user);

                // requestオブジェクトにもユーザーを設定 (コントローラで$request->user()を使用できるように)
                $request->setUserResolver(function () use ($user) {
                    return $user;
                });

                Log::info("VerifyFirebaseToken: AUTH SUCCESS. User attached to GUARDS and REQUEST. {\"user_id\":{$user->id}}");
            } else {
                Log::error("VerifyFirebaseToken: User object not available after JIT. Unauthorized.");
                return response()->json(['message' => 'Unauthenticated: User lookup failed.'], 401);
            }

        } catch (\Kreait\Firebase\Exception\Auth\InvalidToken $e) {
            // トークンが無効な場合は401を返す
            Log::error('VerifyFirebaseToken: Invalid Token. Unauthorized. ' . $e->getMessage());
            return response()->json(['message' => 'Unauthenticated: Invalid Firebase Token.'], 401);
        } catch (Throwable $e) {
            // その他のエラーの場合は500を返す (検証エラーではないため)
            Log::error('VerifyFirebaseToken: Internal Error. ' . json_encode(['message' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]));
            return response()->json(['message' => 'Internal Server Error during verification.'], 500);
        }

        // ログによる最終チェック
        $authCheck = Auth::check();
        $sanctumCheck = Auth::guard('sanctum')->check();
        $requestUser = $request->user() ? $request->user()->id : 'N/A';
        Log::info("VerifyFirebaseToken: FINAL CHECK: DefaultAuth::check()=" . ($authCheck ? 'TRUE' : 'FALSE') . ", Sanctum::check()=" . ($sanctumCheck ? 'TRUE' : 'FALSE') . ", RequestUser={$requestUser}");

        // 成功した場合は、次のミドルウェア/コントローラへ進む
        return $next($request);
    }
}
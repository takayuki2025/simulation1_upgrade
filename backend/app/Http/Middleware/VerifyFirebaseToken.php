<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Exception\Auth\InvalidToken;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth; // ★ Authファサードを追加
use App\Models\User; // ★ ユーザーモデルのインポートを確認
use Symfony\Component\HttpFoundation\Response;

class VerifyFirebaseToken
{
    protected $auth;

    public function __construct(FirebaseAuth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Firebase ID Tokenを検証し、Laravelユーザーを認証する。
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response)  $next
     * @return \Illuminate\Http\Response|Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        // 1. トークンが存在しない場合、直ちに401 JSONレスポンスを返す
        if (!$token) {
            return response()->json(['error' => 'Unauthorized.', 'message' => 'No Firebase ID token provided.'], 401);
        }

        try {
            // 2. トークンを検証し、UIDを取得
            $verifiedIdToken = $this->auth->verifyIdToken($token);
            $uid = $verifiedIdToken->claims()->get('sub');
            
            // 3. (重要) Firebase UIDに対応するLaravelユーザーを検索
            $user = User::where('firebase_uid', $uid)->first();

            if (!$user) {
                // ユーザーがDBに存在しない場合 (登録されていないなど)
                Log::warning("User not found in database.", ['firebase_uid' => $uid]);
                return response()->json([
                    'error' => 'Unauthorized.', 
                    'message' => 'User not registered in the system.'
                ], 401);
            }

            // 4. (重要) Laravelのセッション/ステートレス認証を通じてユーザーをログイン状態にする
            Auth::login($user);
            
            // この時点で $request->user() や Auth::user() が使えるようになります。
            Log::info("Firebase Token Verified and Laravel User Logged in.", ['user_id' => $user->id, 'firebase_uid' => $uid]);

            return $next($request);

        } catch (InvalidToken $e) {
            // トークンが無効または期限切れの場合
            Log::error("Firebase Token Invalid.", ['message' => $e->getMessage()]);
            return response()->json([
                'error' => 'Unauthorized.', 
                'message' => 'Firebase token is invalid or expired.'
            ], 401);
        } catch (\Exception $e) {
            // その他の予期せぬFirebase関連エラー
            Log::error("Firebase Verification Error.", ['message' => $e->getMessage()]);
            return response()->json([
                'error' => 'Internal Server Error.', 
                'message' => 'An unexpected error occurred during token verification.'
            ], 500);
        }
    }
}
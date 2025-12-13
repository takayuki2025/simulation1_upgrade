<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Modules\Auth\Domain\Service\TokenIssuerService;
use Closure;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class JwtAuthenticate
{
    private TokenIssuerService $issuer;

    public function __construct(TokenIssuerService $issuer)
    {
        $this->issuer = $issuer;
    }

    public function handle(Request $request, Closure $next)
    {
        $token = $this->getBearerToken($request);

        if (!$token) {
            return $this->unauthorized("Token not provided");
        }

        try {
            $decoded = $this->issuer->decode($token);
        } catch (Exception $e) {
            Log::warning('JWT decode failed', ['error' => $e->getMessage()]);
            return $this->unauthorized("Invalid token");
        }

        // exp チェック（念のため手動チェック）
        if (property_exists($decoded, 'exp') && time() >= $decoded->exp) {
            return $this->unauthorized("Token expired");
        }

        // DB のユーザーを確認
        $user = User::find($decoded->sub);

        if (!$user) {
            return $this->unauthorized("User not found");
        }

        // ★ UserContext をリクエストにバインド
        $request->setUserResolver(fn () => $user);

        // ★ Multi-Tenant スコープをセット
        $request->attributes->set('tenant_id', $decoded->shop_id ?? null);

        return $next($request);
    }

    private function getBearerToken(Request $request): ?string
    {
        $header = $request->header('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return null;
        }

        return substr($header, 7);
    }

    private function unauthorized(string $message): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'status'  => 'unauthorized'
        ], 401);
    }
}

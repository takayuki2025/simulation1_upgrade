<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Modules\Auth\Domain\Port\TokenVerifierPort;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Closure;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class JwtAuthenticate
{
    public function __construct(
        private TokenVerifierPort $verifier
    ) {
    }

    public function handle(Request $request, Closure $next)
    {
        /**
         * =====================================================
         * ✅ テスト環境専用バイパス（本番には一切影響しない）
         * =====================================================
         * - Feature Test では actingAs() を使う
         * - Authorization ヘッダは不要
         */
        if (app()->environment('testing')) {
            $user = Auth::user();
            if ($user instanceof User) {

                // request()->user() を確定
                $request->setUserResolver(fn () => $user);
                Auth::setUser($user);

                // DDD AuthPrincipal（最小構成）
                $principal = new AuthPrincipal(
                    provider: 'testing',
                    providerUid: (string) $user->id,
                    userId: $user->id,
                    email: $user->email,
                    emailVerified: (bool) ($user->email_verified_at !== null),
                    displayName: $user->name ?? null,
                    shopIds: [],
                );

                $request->attributes->set('auth_principal', $principal);
                $request->attributes->set('tenant_id', null);

                return $next($request);
            }
        }

        /**
         * =====================================================
         * 🔐 本番・ローカル用 JWT 認証（ここから下は従来通り）
         * =====================================================
         */

        $token = $this->getBearerToken($request);

        if (! $token) {
            return $this->unauthorized('Token not provided');
        }

        try {
            $decoded = $this->verifier->decode($token);
        } catch (Exception $e) {
            Log::warning('JWT decode failed', ['error' => $e->getMessage()]);
            return $this->unauthorized('Invalid token');
        }

        // exp チェック
        if (property_exists($decoded, 'exp') && time() >= (int) $decoded->exp) {
            return $this->unauthorized('Token expired');
        }

        // sub = user_id 前提
        $userId = property_exists($decoded, 'sub') ? (int) $decoded->sub : 0;
        if ($userId <= 0) {
            return $this->unauthorized('Invalid token subject');
        }

        $user = User::find($userId);
        if (! $user) {
            return $this->unauthorized('User not found');
        }

        // request / Auth 両方にセット
        $request->setUserResolver(fn () => $user);
        Auth::setUser($user);

        // AuthPrincipal（DDD Auth）
        $principal = new AuthPrincipal(
            provider: 'jwt',
            providerUid: (string) $decoded->sub,
            userId: $user->id,
            email: $user->email,
            emailVerified: (bool) ($user->email_verified_at !== null),
            displayName: $user->name ?? null,
            shopIds: $user->shops()->pluck('shops.id')->all(),
        );

        $request->attributes->set('auth_principal', $principal);

        // tenant_id（claim: tenant or shop_id）
        $tenantId = null;
        if (property_exists($decoded, 'tenant') && $decoded->tenant !== null) {
            $tenantId = (int) $decoded->tenant;
        } elseif (property_exists($decoded, 'shop_id') && $decoded->shop_id !== null) {
            $tenantId = (int) $decoded->shop_id;
        }

        $request->attributes->set('tenant_id', $tenantId);

        return $next($request);
    }

    private function getBearerToken(Request $request): ?string
    {
        $header = $request->header('Authorization');
        if (! $header || ! str_starts_with($header, 'Bearer ')) {
            return null;
        }

        return substr($header, 7);
    }

    private function unauthorized(string $message): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'status'  => 'unauthorized',
        ], 401);
    }
}

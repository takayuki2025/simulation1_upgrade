<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Modules\Auth\Domain\Port\TokenVerifierPort;
use Closure;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

class JwtAuthenticate
{
    public function __construct(
        private TokenVerifierPort $verifier
    ) {
    }

    public function handle(Request $request, Closure $next)
    {
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

        // exp チェック（念のため手動チェック）
        if (property_exists($decoded, 'exp') && time() >= (int)$decoded->exp) {
            return $this->unauthorized('Token expired');
        }

        // sub は user_id を前提（あなたのJWT発行で sub=user->id）
        $userId = property_exists($decoded, 'sub') ? (int)$decoded->sub : 0;
        if ($userId <= 0) {
            return $this->unauthorized('Invalid token subject');
        }

        $user = User::find($userId);
        if (! $user) {
            // JWTは通ってるがDBにユーザーがない＝整合性事故。ここでJIT作成はしない（User基盤が崩れるため）
            return $this->unauthorized('User not found');
        }

        // request()->user() を確定
        $request->setUserResolver(fn () => $user);

        // Auth ファサード側も確定（$request->user() と Auth::user() のズレ事故を防止）
        Auth::setUser($user);

        // ==============================
        // AuthPrincipal を生成（DDD Auth 用）
        // ==============================

        $principal = new AuthPrincipal(
            provider: 'jwt',                       // 認証方式
            providerUid: (string) $decoded->sub,   // 認証ID（今回は user_id だが将来分離可）
            userId: $user->id,                     // ★ ここが最重要
            email: $user->email,
            emailVerified: (bool) ($user->email_verified_at !== null),
            displayName: $user->name ?? null,
            shopIds: $user->shops()->pluck('shops.id')->all(), // ★ あれば
        );


        // Request attributes に inject（UseCase 用）
        $request->attributes->set('auth_principal', $principal);

        // tenant_id を統一（claim: tenant or shop_id）
        $tenantId = null;
        if (property_exists($decoded, 'tenant') && $decoded->tenant !== null) {
            $tenantId = (int)$decoded->tenant;
        } elseif (property_exists($decoded, 'shop_id') && $decoded->shop_id !== null) {
            $tenantId = (int)$decoded->shop_id;
        }

        $request->attributes->set('tenant_id', $tenantId);

        // 追加：必要なら roles も attributes に（認可でclaim参照したい場合）
        // $request->attributes->set('roles', property_exists($decoded, 'roles') ? (array)$decoded->roles : []);

        return $next($request);
    }

    public function resolveUserFromRequest(Request $request): ?User
    {
        $token = $this->getBearerToken($request);
        if (! $token) {
            return null;
        }

        try {
            // ✅ handle() と同じ verifier を使う
            $decoded = $this->verifier->decode($token);
        } catch (\Throwable $e) {
            Log::warning('[resolveUserFromRequest] decode failed', [
                'error' => $e->getMessage(),
            ]);
            return null;
        }

        if (
            !property_exists($decoded, 'sub')
            || (int)$decoded->sub <= 0
        ) {
            return null;
        }

        return User::find((int)$decoded->sub);
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

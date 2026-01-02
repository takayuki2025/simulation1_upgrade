<?php

namespace App\Modules\Auth\Application\Service;

use App\Modules\Auth\Domain\Port\UserProvisioningPort;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

final class JwtUserResolver
{
    public function __construct(
        private UserProvisioningPort $provisioning
    ) {
    }

    public function resolve(Request $request): ?array
    {
        $authHeader = $request->header('Authorization');

        if (! $authHeader || ! str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        $token = substr($authHeader, 7);

        try {
            $payload = JWT::decode(
                $token,
                new Key(config('jwt.secret'), 'HS256')
            );
        } catch (\Throwable $e) {
            Log::warning('[JwtUserResolver] JWT decode failed', [
                'error' => $e->getMessage(),
            ]);
            return null;
        }

        if (! isset($payload->sub)) {
            return null;
        }

        /* =========================================
         * ① DB の事実を確定（JWT → ProvisionedUser）
         * ========================================= */
        $provisioned = $this->provisioning->provisionFromJwt(
            userId: (int) $payload->sub
        );

        /* =========================================
         * ② Laravel User（互換レイヤー）
         * ========================================= */
        $eloquentUser = User::find($provisioned->userId);
        if (! $eloquentUser) {
            return null;
        }

        /* =========================================
         * ③ AuthPrincipal（唯一の真実）
         * ========================================= */
        $principal = AuthPrincipal::fromProvisionedUser(
            $provisioned,
            'jwt',
            (string) $payload->sub
        );

        return [
            'user'      => $eloquentUser, // Laravel Auth 用
            'principal' => $principal,    // Domain 用
        ];
    }
}

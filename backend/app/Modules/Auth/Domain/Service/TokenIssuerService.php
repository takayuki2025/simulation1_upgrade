<?php

namespace App\Modules\Auth\Domain\Service;

use App\Modules\Auth\Domain\Dto\ProvisionedUser;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

final class TokenIssuerService
{
    private string $secret;
    private string $issuer;
    private int $ttl;

    public function __construct()
    {
        $this->secret = config('jwt.secret');
        $this->issuer = config('jwt.issuer', 'omnicommerce-core');
        $this->ttl    = (int) config('jwt.ttl', 3600);
    }

    /**
     * ✅ ProvisionedUser（内部確定結果） + AuthPrincipal（外部ID/プロバイダ）から JWT を発行
     */
    public function issue(ProvisionedUser $user, AuthPrincipal $principal): string
    {
        $now = time();

        $payload = [
            'iss'          => $this->issuer,
            'iat'          => $now,
            'exp'          => $now + $this->ttl,

            // 内部 user
            'sub'          => $user->userId,
            'email'        => $user->email,

            // 外部ID（旧 externalId 相当）
            'provider'     => $principal->provider,       // firebase / jwt / cognito
            'provider_uid' => $principal->providerUid,    // 外部UID
            'firebase_uid' => $principal->provider === 'firebase'
                ? $principal->providerUid
                : null,

            // 認可・テナント
            'roles'        => $user->roles ?? [],
            'shop_ids'     => $user->shopIds ?? [],
            'shop_id'      => $user->tenantId,
            'tenant'       => $user->tenantId,
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function decode(string $jwt): object
    {
        return JWT::decode($jwt, new Key($this->secret, 'HS256'));
    }
}

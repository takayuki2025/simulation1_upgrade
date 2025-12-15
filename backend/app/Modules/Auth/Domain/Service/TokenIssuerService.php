<?php

namespace App\Modules\Auth\Domain\Service;

use App\Modules\Auth\Domain\Dto\ProvisionedUser;
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
        $this->ttl    = config('jwt.ttl', 3600);
    }

    public function issue(ProvisionedUser $user): string
    {
        $now = time();

        $payload = [
            'iss'         => $this->issuer,
            'iat'         => $now,
            'exp'         => $now + $this->ttl,
            'sub'         => $user->userId,
            'email'       => $user->email,
            'firebase_uid' => $user->externalId,
            'roles'       => $user->roles,
            'shop_id'     => $user->tenantId,
            'tenant'      => $user->tenantId,
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function decode(string $jwt): object
    {
        return JWT::decode($jwt, new Key($this->secret, 'HS256'));
    }
}

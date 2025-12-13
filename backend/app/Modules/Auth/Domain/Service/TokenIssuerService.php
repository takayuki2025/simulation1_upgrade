<?php

namespace App\Modules\Auth\Domain\Service;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TokenIssuerService
{
    private string $secret;
    private string $issuer;
    private int $ttl;

    public function __construct()
    {
        $this->secret = config('jwt.secret');
        $this->issuer = config('jwt.issuer', 'omnicommerce-core');
        $this->ttl    = config('jwt.ttl', 3600); // 1 hour
    }

    public function issue(User $user): string
    {
        $now = time();

        $roles = collect($user->formattedRoles())->pluck('slug')->toArray();

        $payload = [
            'iss'     => $this->issuer,
            'iat'     => $now,
            'exp'     => $now + $this->ttl,
            'sub'     => $user->id,
            'email'   => $user->email,
            'firebase_uid' => $user->firebase_uid,
            'roles'   => $roles,
            'shop_id' => $user->shop_id,      // Multi-Tenant Claim
            'tenant'  => $user->shop_id,      // Microservices 用の tenant_id
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function decode(string $jwt): object
    {
        return JWT::decode($jwt, new Key($this->secret, 'HS256'));
    }
}

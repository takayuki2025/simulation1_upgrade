<?php

namespace App\Modules\Auth\Application\Dto;

use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class AuthUserDto
{
    public function __construct(
        public int $id,
        public string $email,
        public bool $emailVerified,   // ★ 追加（意味）
        public bool $hasShop,
        public array $shopRoles,
    ) {
    }

    public static function fromProfilePrincipalAndRoles(
        object $profile,
        AuthPrincipal $principal,     // ★ 型を明示
        array $shopRoles,
    ): self {
        return new self(
            id: $profile->id(),
            email: $profile->email(),
            emailVerified: $principal->emailVerified, // ★ 唯一の正
            hasShop: !empty($shopRoles),
            shopRoles: $shopRoles,
        );
    }

    public function toArray(): array
    {
        return [
            'id'             => $this->id,
            'email'          => $this->email,
            'email_verified' => $this->emailVerified, // ★ フロントが見る
            'has_shop'       => $this->hasShop,
            'shop_roles'     => $this->shopRoles,
        ];
    }
}

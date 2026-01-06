<?php

namespace App\Modules\Auth\Application\Dto;

use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use App\Modules\User\Domain\Entity\Profile;

final class AuthUserDto
{
    public function __construct(
        public int $id,
        public string $email,
        public bool $emailVerified,
        public ?string $displayName,
        public bool $hasShop,
        public array $shopRoles,
    ) {
    }

    /**
     * Profile が存在する場合
     */
    public static function fromPrincipalWithProfile(
        AuthPrincipal $principal,
        Profile $profile,
        array $shopRoles,
    ): self {
        return new self(
            id: $principal->userId,
            email: $principal->email,
            emailVerified: $principal->emailVerified,
            displayName: $profile->displayName(),
            hasShop: !empty($shopRoles),
            shopRoles: $shopRoles,
        );
    }

    /**
     * Profile が存在しない場合（初回ログイン直後など）
     */
    public static function fromPrincipal(
        AuthPrincipal $principal,
        array $shopRoles,
    ): self {
        return new self(
            id: $principal->userId,
            email: $principal->email,
            emailVerified: $principal->emailVerified,
            displayName: null,
            hasShop: !empty($shopRoles),
            shopRoles: $shopRoles,
        );
    }

    public function toArray(): array
    {
        return [
            'id'             => $this->id,
            'email'          => $this->email,
            'email_verified' => $this->emailVerified,
            'display_name'   => $this->displayName,
            'has_shop'       => $this->hasShop,
            'shop_roles'     => $this->shopRoles,
        ];
    }
}

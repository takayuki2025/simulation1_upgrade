<?php

namespace App\Modules\Auth\Application\Dto;

use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use App\Modules\User\Domain\Entity\Profile;

final class AuthUserDto
{
    public function __construct(
        public int $id,
        public string $email,
        public ?string $emailVerifiedAt,
        public bool $hasShop,
        public array $shopRoles,
        public ?array $primaryShop,
    ) {
    }

    public static function fromProfileAndPrincipal(
        Profile $profile,
        AuthPrincipal $principal,
    ): self {

        $shopRoles = array_map(
            fn (int $shopId) => [
                'shop_id' => $shopId,
            ],
            $principal->shopIds,
        );

        $primary = $shopRoles[0] ?? null;

        return new self(
            id: $profile->id,
            email: $profile->email,
            emailVerifiedAt: $principal->emailVerified
                ? now()->toISOString()
                : null,
            hasShop: ! empty($shopRoles),
            shopRoles: $shopRoles,
            primaryShop: $primary,
        );
    }

    public function toArray(): array
    {
        return [
            'id'                => $this->id,
            'email'             => $this->email,
            'email_verified_at' => $this->emailVerifiedAt,
            'has_shop'          => $this->hasShop,
            'shop_roles'        => $this->shopRoles,
            'primary_shop'      => $this->primaryShop,
        ];
    }
}

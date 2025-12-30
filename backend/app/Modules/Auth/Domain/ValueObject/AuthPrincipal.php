<?php

namespace App\Modules\Auth\Domain\ValueObject;

final class AuthPrincipal
{
    private function __construct(
        public readonly string $provider,
        public readonly string $providerUid,
        public readonly int $userId,
        public readonly ?string $email,
        public readonly bool $emailVerified,
        public readonly ?string $displayName,
        public readonly array $shopIds,
    ) {
    }

    public static function fromJwt(
        int $userId,
        string $providerUid,
        ?string $email,
        bool $emailVerified,
        ?string $displayName,
        array $shopIds = [],
    ): self {
        return new self(
            'jwt',
            $providerUid,
            $userId,
            $email,
            $emailVerified,
            $displayName,
            $shopIds,
        );
    }

    public static function fromFirebase(
        string $firebaseUid,
        int $userId,
        ?string $email,
        bool $emailVerified,
        ?string $displayName,
        array $shopIds = [],
    ): self {
        return new self(
            'firebase',
            $firebaseUid,
            $userId,
            $email,
            $emailVerified,
            $displayName,
            $shopIds,
        );
    }

    public static function fromCognito(
        string $sub,
        int $userId,
        ?string $email,
        bool $emailVerified,
        ?string $displayName,
        array $shopIds = [],
    ): self {
        return new self(
            'cognito',
            $sub,
            $userId,
            $email,
            $emailVerified,
            $displayName,
            $shopIds,
        );
    }

    public function ownsShop(int $shopId): bool
    {
        return in_array($shopId, $this->shopIds, true);
    }

    public function isVerified(): bool
    {
        return $this->emailVerified;
    }
}

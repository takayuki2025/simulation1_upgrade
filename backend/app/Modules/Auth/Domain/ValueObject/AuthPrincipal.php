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

    /* =====================================================
     * JWT
     * ===================================================== */
    public static function fromJwt(
        int $userId,
        string $providerUid,
        ?string $email,
        bool $emailVerified,
        ?string $displayName,
        array $shopIds = [],
    ): self {
        return new self(
            provider: 'jwt',
            providerUid: $providerUid,
            userId: $userId,
            email: $email,
            emailVerified: $emailVerified,
            displayName: $displayName,
            shopIds: $shopIds,
        );
    }

    /* =====================================================
     * Firebase
     * ===================================================== */
    public static function fromFirebase(
        int $userId,
        string $firebaseUid,
        ?string $email,
        bool $emailVerified,
        ?string $displayName,
        array $shopIds = [],
    ): self {
        return new self(
            provider: 'firebase',
            providerUid: $firebaseUid,
            userId: $userId,
            email: $email,
            emailVerified: $emailVerified,
            displayName: $displayName,
            shopIds: $shopIds,
        );
    }

    /* =====================================================
     * Cognito
     * ===================================================== */
    public static function fromCognito(
        int $userId,
        string $sub,
        ?string $email,
        bool $emailVerified,
        ?string $displayName,
        array $shopIds = [],
    ): self {
        return new self(
            provider: 'cognito',
            providerUid: $sub,
            userId: $userId,
            email: $email,
            emailVerified: $emailVerified,
            displayName: $displayName,
            shopIds: $shopIds,
        );
    }

    /* =====================================================
     * Helpers
     * ===================================================== */
    public function ownsShop(int $shopId): bool
    {
        return in_array($shopId, $this->shopIds, true);
    }

    public function isVerified(): bool
    {
        return $this->emailVerified;
    }
}

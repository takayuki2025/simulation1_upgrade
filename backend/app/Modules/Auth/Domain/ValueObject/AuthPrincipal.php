<?php

namespace App\Modules\Auth\Domain\ValueObject;

use App\Modules\Auth\Domain\Dto\ProvisionedUser;

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
     * ✅ 唯一の生成口
     * ===================================================== */
    public static function fromProvisionedUser(
        ProvisionedUser $user,
        string $provider,
        string $providerUid,
        ?string $displayName = null,
    ): self {
        return new self(
            provider: $provider,
            providerUid: $providerUid,
            userId: $user->userId,
            email: $user->email,
            emailVerified: $user->emailVerified,
            displayName: $displayName,
            shopIds: $user->shopIds,
        );
    }

    /* =========================
       Domain Rules
    ========================= */
    public function isVerified(): bool
    {
        return $this->emailVerified;
    }

    public function ownsShop(int $shopId): bool
    {
        return in_array($shopId, $this->shopIds, true);
    }
}

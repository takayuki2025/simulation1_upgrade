<?php

namespace App\Modules\Auth\Domain\Dto;

final class ProvisionedUser
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $email,
        public readonly array $roles,
        public readonly array $shopIds,
        public readonly ?int $tenantId,
        public readonly bool $isFirstLogin,
        public readonly bool $emailVerified,
    ) {
    }
}

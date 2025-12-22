<?php

namespace App\Modules\Auth\Domain\Dto;

final class ProvisionedUser
{
    /**
     * @param string[] $roles Slug配列（例: ['customer', 'owner']）
     */
    public function __construct(
        public readonly int $userId,
        public readonly string $email,
        public readonly string $externalId,
        public readonly array $roles,
        public readonly ?int $tenantId, // shop_id
        public readonly bool $isFirstLogin,
         public readonly ?int $shopId,
    ) {
    }
}

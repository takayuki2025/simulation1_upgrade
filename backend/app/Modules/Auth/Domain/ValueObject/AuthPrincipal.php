<?php

namespace App\Modules\Auth\Domain\ValueObject;

final class AuthPrincipal
{
    public function __construct(
        public readonly string $provider,        // jwt / firebase / cognito
        public readonly string $providerUid,     // 外部ID
        public readonly int $userId,              // ★ 内部 user.id
        public readonly ?string $email,
        public readonly bool $emailVerified,
        public readonly ?string $displayName,
        public readonly array $shopIds = [],      // ★ 所属ショップID
    ) {
    }
}

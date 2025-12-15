<?php

namespace App\Modules\Auth\Domain\ValueObject;

final class AuthPrincipal
{
    public function __construct(
        public readonly string $provider,        // 'firebase'
        public readonly string $providerUid,     // firebase uid (sub)
        public readonly ?string $email,
        public readonly bool $emailVerified,
        public readonly ?string $displayName,
    ) {
    }
}

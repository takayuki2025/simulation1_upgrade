<?php

namespace App\Modules\Auth\Domain\Dto;

/**
 * 認証は済んでいるが、userId はまだ無い段階の入力
 */
final class ProvisioningInput
{
    public function __construct(
        public readonly string $provider,       // firebase / jwt / cognito
        public readonly string $providerUid,    // firebase_uid / sub
        public readonly ?string $email,
        public readonly bool $emailVerified,
        public readonly ?string $displayName,
    ) {
    }
}

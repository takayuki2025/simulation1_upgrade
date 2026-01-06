<?php

namespace App\Modules\User\Application\Dto;

use App\Modules\User\Domain\Entity\Profile;

final class ProfileDto
{
    public function __construct(
        public int $userId,
        public string $displayName,

        // profile
        public ?string $postNumber,
        public ?string $address,
        public ?string $building,
        public ?string $userImage,

        // auth view（v1互換）
        public ?string $email = null,
        public ?string $emailVerifiedAt = null,
    ) {
    }

    public static function fromEntity(Profile $profile, ?array $authView = null): self
    {
        return new self(
            userId: $profile->userId(),
            displayName: $profile->displayName(),
            postNumber: $profile->postNumber(),
            address: $profile->address(),
            building: $profile->building(),
            userImage: $profile->userImage(),

            email: $authView['email'] ?? null,
            emailVerifiedAt: $authView['email_verified_at'] ?? null,
        );
    }
}
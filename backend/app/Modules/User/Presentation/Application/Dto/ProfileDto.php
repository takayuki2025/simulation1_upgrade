<?php

namespace App\Modules\User\Presentation\Application\Dto;

use App\Modules\User\Presentation\Domain\Entity\Profile;

class ProfileDto
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $postNumber,
        public ?string $address,
        public ?string $building,
        public ?string $userImage,
        public ?string $emailVerifiedAt,
    ) {
    }

    public static function fromEntity(Profile $entity): self
    {
        return new self(
            id: $entity->id,
            name: $entity->name,
            email: $entity->email,
            postNumber: $entity->postNumber,
            address: $entity->address,
            building: $entity->building,
            userImage: $entity->userImage,
            emailVerifiedAt: $entity->emailVerifiedAt?->format('Y-m-d H:i:s'),
        );
    }

    public function toArray(): array
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'email'             => $this->email,
            'post_number'       => $this->postNumber,
            'address'           => $this->address,
            'building'          => $this->building,
            'user_image'        => $this->userImage,
            'email_verified_at' => $this->emailVerifiedAt,
        ];
    }
}

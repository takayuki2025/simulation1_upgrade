<?php

namespace App\Domain\Entity;

class UserProfile
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $post_number,
        public ?string $address,
        public ?string $building,
        public ?string $user_image,
    ) {
    }
}

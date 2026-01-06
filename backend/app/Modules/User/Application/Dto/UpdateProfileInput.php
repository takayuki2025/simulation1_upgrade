<?php

namespace App\Modules\User\Application\Dto;

final class UpdateProfileInput
{
    public function __construct(
        public readonly string $displayName,
        public readonly ?string $postNumber,
        public readonly ?string $address,
        public readonly ?string $building,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            displayName: (string)($data['name'] ?? ''), // 互換のため name を受ける
            postNumber: $data['post_number'] ?? null,
            address: $data['address'] ?? null,
            building: $data['building'] ?? null,
        );
    }
}

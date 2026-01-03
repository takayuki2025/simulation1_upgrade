<?php

namespace App\Modules\User\Domain\Entity;

class Profile
{
    public function __construct(
        public readonly int $id,
        public string $name,
        public string $email,
        public ?string $postNumber,
        public ?string $address,
        public ?string $building,
        public ?string $userImage,
        public ?\DateTimeImmutable $emailVerifiedAt,
    ) {
    }

    public static function fromArray(array $row): self
    {
        return new self(
            id: (int) $row['id'],
            name: $row['name'],
            email: $row['email'],
            postNumber: $row['post_number'] ?? null,
            address: $row['address'] ?? null,
            building: $row['building'] ?? null,
            userImage: $row['user_image'] ?? null,
            emailVerifiedAt: !empty($row['email_verified_at'])
                ? new \DateTimeImmutable($row['email_verified_at'])
                : null,
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
            'email_verified_at' => $this->emailVerifiedAt?->format('Y-m-d H:i:s'),
        ];
    }

    // =====================
    // getters（読み取り専用）
    // =====================

    public function id(): int
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function email(): string
    {
        return $this->email;
    }

    public function postNumber(): ?string
    {
        return $this->postNumber;
    }

    public function address(): ?string
    {
        return $this->address;
    }

    public function building(): ?string
    {
        return $this->building;
    }

    public function userImage(): ?string
    {
        return $this->userImage;
    }

    public function emailVerifiedAt(): ?\DateTimeImmutable
    {
        return $this->emailVerifiedAt;
    }
}
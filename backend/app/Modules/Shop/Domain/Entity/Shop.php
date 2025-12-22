<?php

namespace App\Modules\Shop\Domain\Entity;

use App\Modules\Shop\Domain\Enum\ShopStatus;

final class Shop
{
    public function __construct(
        private ?int $id,
        private string $shopCode,        // ★ 追加
        private int $ownerUserId,
        private string $name,
        private ShopStatus $status,
    ) {
    }

    public static function create(
        int $ownerUserId,
        string $name,
        string $shopCode,               // ★ 追加
    ): self {
        return new self(
            id: null,
            shopCode: $shopCode,
            ownerUserId: $ownerUserId,
            name: $name,
            status: ShopStatus::ACTIVE,
        );
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function shopCode(): string   // ★ 追加
    {
        return $this->shopCode;
    }

    public function ownerUserId(): int
    {
        return $this->ownerUserId;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function status(): ShopStatus
    {
        return $this->status;
    }

    public function isActive(): bool
    {
        return $this->status === ShopStatus::ACTIVE;
    }

    public function suspend(): void
    {
        $this->status = ShopStatus::SUSPENDED;
    }
}

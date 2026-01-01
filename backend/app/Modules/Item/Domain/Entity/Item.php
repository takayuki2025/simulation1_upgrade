<?php

namespace App\Modules\Item\Domain\Entity;

use App\Modules\Item\Domain\ValueObject\{
    ItemId,
    Money,
    CategoryList,
    ItemImagePath,
    StockCount
};
use DomainException;

final class Item
{
    private function __construct(
        private ?ItemId $id,
        private string $itemOrigin,
        private ?int $shopId,
        private ?int $createdByUserId,
        private string $name,
        private Money $price,
        private string $explain,
        private string $condition,
        private CategoryList $category,
        private ?ItemImagePath $itemImage,
        private StockCount $remain,
    ) {
    }

    /* ========= 新規生成 ========= */
    public static function createNew(
        string $itemOrigin,
        ?int $shopId,
        ?int $createdByUserId,
        string $name,
        Money $price,
        string $explain,
        string $condition,
        CategoryList $category,
        ?ItemImagePath $itemImage,
        StockCount $remain,
    ): self {
        if ($itemOrigin === 'USER_PERSONAL' && $createdByUserId === null) {
            throw new DomainException('USER_PERSONAL requires createdByUserId');
        }

        if ($itemOrigin === 'SHOP_MANAGED' && $shopId === null) {
            throw new DomainException('SHOP_MANAGED requires shopId');
        }

        return new self(
            id: null,
            itemOrigin: $itemOrigin,
            shopId: $shopId,
            createdByUserId: $createdByUserId,
            name: $name,
            price: $price,
            explain: $explain,
            condition: $condition,
            category: $category,
            itemImage: $itemImage,
            remain: $remain,
        );
    }

    /* ========= Repository 用 ========= */
    public static function reconstitute(
        ?ItemId $id,
        string $itemOrigin,
        ?int $shopId,
        ?int $createdByUserId,
        string $name,
        Money $price,
        string $explain,
        string $condition,
        CategoryList $category,
        ?ItemImagePath $itemImage,
        StockCount $remain,
    ): self {
        return new self(
            id: $id,
            itemOrigin: $itemOrigin,
            shopId: $shopId,
            createdByUserId: $createdByUserId,
            name: $name,
            price: $price,
            explain: $explain,
            condition: $condition,
            category: $category,
            itemImage: $itemImage,
            remain: $remain,
        );
    }

    /* ========= ID 管理 ========= */

    public function setId(ItemId $id): void
    {
        if ($this->id !== null) {
            throw new DomainException('Item ID already set');
        }
        $this->id = $id;
    }

    public function id(): int
    {
        if ($this->id === null) {
            throw new DomainException('Item ID is not initialized');
        }
        return $this->id->getValue();
    }

    public function getId(): ?ItemId
    {
        return $this->id;
    }

    public function origin(): ItemOrigin
    {
        return $this->origin;
    }

    public function getShopId(): ?int
    {
        return $this->shopId;
    }

    public function getCreatedByUserId(): ?int
    {
        return $this->createdByUserId;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPrice(): Money
    {
        return $this->price;
    }

    public function getExplain(): string
    {
        return $this->explain;
    }

    public function getCondition(): string
    {
        return $this->condition;
    }

    public function getCategory(): CategoryList
    {
        return $this->category;
    }

    public function getItemImage(): ?ItemImagePath
    {
        return $this->itemImage;
    }

    public function getRemain(): StockCount
    {
        return $this->remain;
    }

    public function getItemOrigin(): string
    {
        return $this->itemOrigin;
    }

    /* =========================
       Domain Logic
    ========================= */

    public function isSoldOut(): bool
    {
        return $this->remain->isZero();
    }

    public function canBePurchased(int $quantity = 1): bool
    {
        return $this->remain->getValue() >= $quantity;
    }
}

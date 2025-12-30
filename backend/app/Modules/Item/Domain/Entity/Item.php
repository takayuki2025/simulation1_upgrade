<?php

namespace App\Modules\Item\Domain\Entity;

use App\Modules\Item\Domain\ValueObject\{
    ItemId,
    Money,
    CategoryList,
    ItemImagePath,
    StockCount
};

final class Item
{
    private function __construct(
        private ?ItemId $id,
        private ?int $shopId,
        private ?int $createdByUserId,   // ✅ 正式カラム
        private string $name,
        private Money $price,
        private string $explain,
        private string $condition,
        private CategoryList $category,
        private ?ItemImagePath $itemImage,
        private StockCount $remain,
    ) {
    }

    /* =====================================================
       Factory（再構築専用）
    ===================================================== */

    public static function reconstitute(
        ?ItemId $id,
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
            shopId: $shopId,
            createdByUserId: $createdByUserId,
            name: $name,
            price: $price,
            explain: $explain,
            condition: $condition,
            category: $category,
            itemImage: $itemImage,
            remain: $remain
        );
    }

    /* =====================================================
       Getters（Repository / UseCase 用）
    ===================================================== */

    public function getId(): ?ItemId
    {
        return $this->id;
    }

    public function getShopId(): ?int
    {
        return $this->shopId;
    }

    /**
     * ★ 追加：Repository / ReadModel 判定用
     */
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

    /* =====================================================
       Domain Mutation（不変オブジェクト）
    ===================================================== */

    public function withItemImage(ItemImagePath $image): self
    {
        return self::reconstitute(
            id: $this->id,
            shopId: $this->shopId,
            createdByUserId: $this->createdByUserId,
            name: $this->name,
            price: $this->price,
            explain: $this->explain,
            condition: $this->condition,
            category: $this->category,
            itemImage: $image,
            remain: $this->remain
        );
    }

    public function decreaseStock(int $quantity): self
    {
        if ($this->remain->getValue() < $quantity) {
            throw new \DomainException('在庫が不足しています');
        }

        return self::reconstitute(
            id: $this->id,
            shopId: $this->shopId,
            createdByUserId: $this->createdByUserId,
            name: $this->name,
            price: $this->price,
            explain: $this->explain,
            condition: $this->condition,
            category: $this->category,
            itemImage: $this->itemImage,
            remain: $this->remain->decrease($quantity)
        );
    }

    /* =====================================================
       Domain Logic
    ===================================================== */

    public function isSoldOut(): bool
    {
        return $this->remain->isZero();
    }

    public function canBePurchased(int $quantity = 1): bool
    {
        return $this->remain->getValue() >= $quantity;
    }
}

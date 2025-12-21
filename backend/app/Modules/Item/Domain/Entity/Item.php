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
        private string $name,
        private Money $price,
        private string $explain,
        private string $condition,
        private CategoryList $category,
        private ?ItemImagePath $itemImage,
        private StockCount $remain,
    ) {
    }

    /* =========================
       Factory（再構築専用）
    ========================= */

    public static function reconstitute(
        ?ItemId $id,
        ?int $shopId,
        string $name,
        Money $price,
        string $explain,
        string $condition,
        CategoryList $category,
        ?ItemImagePath $itemImage,
        StockCount $remain,
    ): self {
        return new self(
            $id,
            $shopId,
            $name,
            $price,
            $explain,
            $condition,
            $category,
            $itemImage,
            $remain
        );
    }

    /* =========================
       Getters
    ========================= */

    public function getId(): ?ItemId
    {
        return $this->id;
    }
    public function getShopId(): ?int
    {
        return $this->shopId;
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

    /* =========================
       Domain Mutation（安全）
    ========================= */

    public function withItemImage(ItemImagePath $image): self
    {
        return self::reconstitute(
            $this->id,
            $this->shopId,
            $this->name,
            $this->price,
            $this->explain,
            $this->condition,
            $this->category,
            $image,
            $this->remain
        );
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

    public function decreaseStock(int $quantity): self
    {
        if (! $this->canBePurchased($quantity)) {
            throw new \DomainException('在庫が不足しています');
        }

        return new self(
            id: $this->id,
            shopId: $this->shopId,
            name: $this->name,
            price: $this->price,
            explain: $this->explain,
            condition: $this->condition,
            category: $this->category,
            // brand: $this->brand,
            itemImage: $this->itemImage,
            remain: $this->remain->decrease($quantity),
        );
    }

}

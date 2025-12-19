<?php

namespace App\Modules\Item\Domain\Entity;

use App\Modules\Item\Domain\Entity\ItemDraft;
use App\Modules\Item\Domain\ValueObject\{
    ItemId,
    ItemName,
    Money,
    CategoryList,
    ItemImagePath,
    StockCount
};

final class Item
{
    private ?ItemId $id;
    private ?int $shopId;
    private string $name;
    private Money $price;
    private string $explain;
    private string $condition;
    private CategoryList $category;
    private ?string $brand;
    private ItemImagePath $itemImage;
    private StockCount $remain;

    public function __construct(
        ?ItemId $id,
        ?int $shopId,
        string $name,
        Money $price,
        string $explain,
        string $condition,
        CategoryList $category,
        ?string $brand,
        ItemImagePath $itemImage,
        StockCount $remain,
    ) {
        $this->id = $id;
        $this->shopId = $shopId;
        $this->name = $name;
        $this->price = $price;
        $this->explain = $explain;
        $this->condition = $condition;
        $this->category = $category;
        $this->brand = $brand;
        $this->itemImage = $itemImage;
        $this->remain = $remain;
    }

    /* =========================
       Getter（read-only）
    ========================= */

    public function getId(): ?ItemId
    {
        return $this->id;
    }
    public function getShopId(): int
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
    public function getBrand(): ?string
    {
        return $this->brand;
    }
    public function getItemImage(): ItemImagePath
    {
        return $this->itemImage;
    }
    public function getRemain(): StockCount
    {
        return $this->remain;
    }

    /* ===== Factory ===== */

    public static function publishFromDraft(ItemDraft $draft): self
    {
        return new self(
            id: null,
            shopId: $draft->sellerId()->id(),
            name: $draft->name()->value(),
            price: $draft->price(),
            explain: $draft->explain(),
            condition: $draft->condition(),
            category: $draft->category() ?? new CategoryList([]),
            brand: $draft->brand()?->raw(),
            itemImage: $draft->itemImage(),
            remain: $draft->remain(),
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
            brand: $this->brand,
            itemImage: $this->itemImage,
            remain: $this->remain->decrease($quantity),
        );
    }
}

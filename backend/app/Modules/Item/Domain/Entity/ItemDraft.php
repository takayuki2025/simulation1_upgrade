<?php

namespace App\Modules\Item\Domain\Entity;

use App\Modules\Item\Domain\ValueObject\{
    ItemDraftId,
    SellerId,
    ItemName,
    Money,
    BrandName,
    ItemStatus,
    CategoryList,
    ItemImagePath,
    StockCount
};

final class ItemDraft
{
    private ?ItemImagePath $itemImage = null;

    private function __construct(
        private ItemDraftId $id,
        private SellerId $sellerId,
        private ItemName $name,
        private Money $price,
        private ?BrandName $brandRaw,
        private ItemStatus $status,
        private string $explain,
        private string $condition,
        private CategoryList $category,
        private StockCount $remain,
    ) {}

    /* ========= Factory ========= */

    public static function create(
        ItemDraftId $id,
        SellerId $sellerId,
        ItemName $name,
        Money $price,
        ?BrandName $brandRaw,
    ): self {
        return new self(
            id: $id,
            sellerId: $sellerId,
            name: $name,
            price: $price,
            brandRaw: $brandRaw,
            status: ItemStatus::DRAFT,
            explain: '',
            condition: '',
            category: new CategoryList([]),
            remain: new StockCount(1),
        );
    }

    public static function reconstruct(
        ItemDraftId $id,
        SellerId $sellerId,
        ItemName $name,
        Money $price,
        ?BrandName $brandRaw,
        ItemStatus $status,
    ): self {
        return new self(
            id: $id,
            sellerId: $sellerId,
            name: $name,
            price: $price,
            brandRaw: $brandRaw,
            status: $status,
            explain: '',
            condition: '',
            category: new CategoryList([]),
            remain: new StockCount(1),
        );
    }

    /* ========= Getter ========= */

    public function id(): ItemDraftId { return $this->id; }
    public function sellerId(): SellerId { return $this->sellerId; }
    public function name(): ItemName { return $this->name; }
    public function price(): Money { return $this->price; }
    public function brand(): ?BrandName { return $this->brandRaw; }
    public function status(): ItemStatus { return $this->status; }

    public function itemImage(): ?ItemImagePath
    {
        return $this->itemImage;
    }

    /* ========= Domain Logic ========= */

    public function attachImage(ItemImagePath $path): void
    {
        $this->itemImage = $path;
    }

    public function hasImage(): bool
    {
        return $this->itemImage !== null;
    }

    public function isPublishableV1(): bool
    {
        return $this->status === ItemStatus::DRAFT
            && $this->hasImage();
    }

    public function markPublished(): void
    {
        $this->status = ItemStatus::PUBLISHED;
    }

    // public function setId(ItemDraftId $id): void
    // {
    //     $this->id = $id;
    // }
}
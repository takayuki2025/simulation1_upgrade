<?php

namespace App\Modules\Item\Domain\Entity;

use App\Modules\Item\Domain\ValueObject\ItemId;
use App\Modules\Item\Domain\ValueObject\Price;
use App\Modules\Item\Domain\ValueObject\StockCount;
use App\Modules\Item\Domain\ValueObject\CategoryList;
use App\Modules\Item\Domain\ValueObject\ItemImagePath;

class Item
{
    public function __construct(
        private ?ItemId $id,
        private int $userId,
        private ?int $shopId,
        private string $name,
        private Price $price,
        private string $explain,
        private string $condition,
        private CategoryList $category,
        private ?string $brand,
        private ItemImagePath $itemImage,
        private StockCount $remain
    ) {
    }

    public function getId(): ?ItemId
    {
        return $this->id;
    }
    public function getUserId(): int
    {
        return $this->userId;
    }
    public function getShopId(): ?int
    {
        return $this->shopId;
    }
    public function getName(): string
    {
        return $this->name;
    }
    public function getPrice(): Price
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

    public function setShopId(?int $shopId): void
    {
        $this->shopId = $shopId;
    }

    public function changeRemain(StockCount $remain): void
    {
        $this->remain = $remain;
    }
}

<?php

namespace App\Modules\Item\Domain\Collection;

use App\Modules\Item\Domain\Entity\Item;
use App\Models\Item as EloquentItem;
use Illuminate\Support\Collection;
use App\Modules\Item\Domain\ValueObject\{
    ItemId,
    Price,
    StockCount,
    CategoryList,
    ItemImagePath
};
use Countable;
use IteratorAggregate;
use ArrayIterator;

final class Items
{
    /** @var Item[] */
    private array $items;

    public function __construct(array $items)
    {
        $this->items = $items;
    }

    public static function fromArray(array $items): self
    {
        return new self($items);
    }

    /**
     * Controller / Resource 用
     */
    public function toArray(): array
    {
        return $this->items;
    }

    public static function fromEloquent(Collection $eloquentItems): self
    {
        return new self(
            $eloquentItems
                ->map(fn (EloquentItem $model) => self::toDomain($model))
                ->all()
        );
    }

    /**
     * Domain Item 配列を返す（Controller / Resource 用）
     *
     * @return Item[]
     */
    public function all(): array
    {
        return $this->items;
    }

    /**
     * foreach 対応
     */
    public function getIterator(): ArrayIterator
    {
        return new ArrayIterator($this->items);
    }

    /**
     * 個数
     */
    public function count(): int
    {
        return count($this->items);
    }

    /**
     * Eloquent → Domain 変換
     */
    private static function toDomain(EloquentItem $model): Item
    {
        return new Item(
            id: new ItemId($model->id),          // ★ int禁止
            userId: $model->user_id,
            shopId: $model->shop_id,
            name: $model->name,
            price: new Price($model->price),
            explain: $model->explain,
            condition: $model->condition,
            category: new CategoryList($model->category ?? []),
            brand: $model->brand,
            itemImage: new ItemImagePath($model->item_image),
            remain: new StockCount($model->remain),
        );
    }


    public function isEmpty(): bool
    {
        return empty($this->items);
    }
}

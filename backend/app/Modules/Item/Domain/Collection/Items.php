<?php

namespace App\Modules\Item\Domain\Collection;

use App\Modules\Item\Domain\Entity\Item;
use App\Models\Item as EloquentItem;
use Illuminate\Support\Collection;
use App\Modules\Item\Domain\ValueObject\Money;
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
        // ★ category を必ず array に正規化
        $categories = [];

        if (is_string($model->category)) {
            $decoded = json_decode($model->category, true);
            $categories = is_array($decoded) ? $decoded : [];
        } elseif (is_array($model->category)) {
            $categories = $model->category;
        }

        return Item::reconstitute(
            new ItemId($model->id),
            $model->shop_id,
            $model->name,
            new Money($model->price, 'JPY'),
            $model->explain,
            $model->condition,
            new CategoryList($categories),   // ← ここが修正点
            ItemImagePath::fromRaw($model->item_image),
            new StockCount($model->remain),
        );
    }


    public function isEmpty(): bool
    {
        return empty($this->items);
    }

}

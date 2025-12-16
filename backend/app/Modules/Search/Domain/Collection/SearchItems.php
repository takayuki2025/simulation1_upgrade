<?php

namespace App\Modules\Search\Domain\Collection;

use Illuminate\Support\Collection;
use App\Models\Item;

final class SearchItems
{
    /**
     * @param Collection<int, Item> $items
     */
    private function __construct(
        private Collection $items
    ) {
    }

    /**
     * Eloquent Collection → Domain Collection
     */
    public static function fromEloquent(Collection $items): self
    {
        return new self($items);
    }

    /**
     * Domain Collection → array
     */
    public function all(): Collection
    {
        return $this->items;
    }

    /**
     * 件数
     */
    public function count(): int
    {
        return $this->items->count();
    }

    /**
     * 空かどうか
     */
    public function isEmpty(): bool
    {
        return $this->items->isEmpty();
    }
}

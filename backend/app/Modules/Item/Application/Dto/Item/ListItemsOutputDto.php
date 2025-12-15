<?php

namespace App\Modules\Item\Application\Dto\Item;

use App\Modules\Item\Domain\Collection\Items;

final class ItemDetailOutputDto
{
    public function __construct(
        public readonly Item $item,
        public readonly iterable $comments,
        public readonly bool $isFavorited,
        public readonly int $favoritesCount,
    ) {
    }
}

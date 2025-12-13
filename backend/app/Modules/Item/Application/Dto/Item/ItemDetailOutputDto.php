<?php

namespace App\Modules\Item\Application\Dto\Item;

use App\Modules\Item\Domain\Entity\Item;

class ItemDetailOutputDto
{
    /**
     * @param Item $item
     * @param iterable $comments   // Eloquent Comment[] を想定
     * @param bool $isFavorited
     * @param int $favoritesCount
     */
    public function __construct(
        public readonly Item $item,
        public readonly iterable $comments,
        public readonly bool $isFavorited,
        public readonly int $favoritesCount,
    ) {
    }
}

<?php

namespace App\Modules\Item\Presentation\Application\Dto\Item;

use App\Modules\Item\Presentation\Domain\Entity\Item;

class ItemDetailOutputDto
{
    public function __construct(
        public readonly Item $item,
        public readonly array $comments = [],
        public readonly bool $isFavorited = false,
        public readonly int $favoritesCount = 0,
    ) {
    }
}

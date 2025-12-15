<?php

namespace App\Modules\Item\Application\Dto\Item;




final class ListItemsInputDto
{
    public function __construct(
        public readonly int $limit = 20,
        public readonly int $page = 1,
        public readonly ?string $keyword = null,
    ) {
    }
}


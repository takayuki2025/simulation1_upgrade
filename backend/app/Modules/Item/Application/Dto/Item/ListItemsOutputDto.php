<?php

// ListItemsOutputDto.php

namespace App\Modules\Item\Application\Dto\Item;

class ListItemsOutputDto
{
    public function __construct(
        public readonly iterable $items,
    ) {
    }
}

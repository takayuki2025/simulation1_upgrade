<?php

// ListItemsOutputDto.php

namespace App\Modules\Item\Presentation\Application\Dto\Item;

class ListItemsOutputDto
{
    public function __construct(
        public readonly iterable $items,
    ) {
    }
}

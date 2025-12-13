<?php

// ListItemsInputDto.php

namespace App\Modules\Item\Application\Dto\Item;

class ListItemsInputDto
{
    public function __construct(
        public readonly ?string $search,
        public readonly ?int $excludeUserId,
    ) {
    }
}

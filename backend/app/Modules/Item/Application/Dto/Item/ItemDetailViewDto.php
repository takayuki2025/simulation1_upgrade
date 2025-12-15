<?php

namespace App\Modules\Item\Application\Dto\Item;


final class ItemDetailViewDto
{
    public function __construct(
        public int $id,
        public string $name,
        public int $price,
        public ?string $brand,
        public string $explain,
        public string $condition,
        public array $category,
        public ?string $item_image,
        public int $remain,
        public int $user_id,
    ) {
    }
}

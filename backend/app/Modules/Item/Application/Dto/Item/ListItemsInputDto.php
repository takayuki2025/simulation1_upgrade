<?php

namespace App\Modules\Item\Application\Dto\Item;




final class ListItemsInputDto
{
    public function __construct(
        public int $limit,
        public int $page,
        public ?string $keyword,
        public ?int $viewerUserId = null, // ← 追加
    ) {}
}
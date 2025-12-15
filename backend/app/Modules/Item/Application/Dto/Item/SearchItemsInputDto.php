<?php

namespace App\Modules\Item\Application\Dto\Item;


final class SearchItemsInputDto
{
    public function __construct(
        public readonly string $keyword
    ) {
    }
}


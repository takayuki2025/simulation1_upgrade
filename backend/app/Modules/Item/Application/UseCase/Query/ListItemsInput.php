<?php

namespace App\Modules\Item\Application\UseCase\Query;


final class ListItemsInput
{
    public function __construct(
        public readonly int $limit = 20,
        public readonly int $page = 1,
    ) {
    }
}

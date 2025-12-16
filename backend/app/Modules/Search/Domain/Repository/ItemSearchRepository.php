<?php

namespace App\Modules\Search\Domain\Repository;

use App\Modules\Search\Domain\Collection\SearchItems;

interface ItemSearchRepository
{
    public function searchPublicItems(
        string $keyword,
        ?int $excludeUserId,
        int $limit,
        int $page
    ): SearchItems;
}

<?php

namespace App\Modules\Search\Application\UseCase\Query;

use App\Modules\Search\Domain\Repository\ItemSearchRepository;
use App\Modules\Search\Domain\Collection\SearchItems;

final class ItemSearchQuery
{
    public function __construct(
        private ItemSearchRepository $repository
    ) {}

    public function searchPublicItems(
        string $keyword,
        ?int $excludeUserId,
        int $page = 1,
        int $limit = 20
    ): SearchItems {
        return $this->repository->searchPublicItems(
            keyword: $keyword,
            excludeUserId: $excludeUserId,
            limit: $limit,
            page: $page
        );
    }
}
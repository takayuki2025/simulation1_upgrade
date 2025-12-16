<?php

namespace App\Modules\Search\Application\UseCase\Query;

use App\Modules\Search\Domain\Collection\SearchItems;

final class PublicItemSearchUseCase
{
    public function __construct(
        private ItemSearchQuery $query
    ) {
    }

    public function execute(
        string $keyword,
        ?int $viewerUserId,
        int $page = 1
    ): SearchItems {
        return $this->query->searchPublicItems(
            keyword: $keyword,
            excludeUserId: $viewerUserId,
            page: $page
        );
    }
}

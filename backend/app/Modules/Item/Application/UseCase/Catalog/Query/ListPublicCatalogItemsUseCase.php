<?php

namespace App\Modules\Item\Application\UseCase\Catalog\Query;

use App\Modules\Item\Infrastructure\Persistence\Query\PublicCatalogItemReadRepository;
use App\Modules\Item\ReadModel\PublicCatalog\PublicCatalogItemCollection;

final class ListPublicCatalogItemsUseCase
{
    public function __construct(
        private readonly PublicCatalogItemReadRepository $readRepository
    ) {
    }

    public function execute(
        int $limit,
        int $page,
        ?string $keyword,
        ?int $viewerShopId
    ): PublicCatalogItemCollection {
        return $this->readRepository->paginate(
            limit: $limit,
            page: $page,
            keyword: $keyword,
            viewerShopId: $viewerShopId
        );
    }
}

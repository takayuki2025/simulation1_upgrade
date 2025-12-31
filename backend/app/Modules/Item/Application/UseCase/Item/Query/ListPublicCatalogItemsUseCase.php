<?php

namespace App\Modules\Item\Application\UseCase\Item\Query;

use App\Modules\Item\Infrastructure\Persistence\Query\PublicCatalogItemReadRepository;
use App\Modules\Item\ReadModel\PublicCatalog\PublicCatalogItemCollection;

final class ListPublicCatalogItemsUseCase
{
    public function __construct(
        private readonly PublicCatalogItemReadRepository $readRepo
    ) {
    }

    public function execute(
        int $limit,
        int $page,
        ?string $keyword,
        array $viewerShopIds,
        ?int $viewerUserId,
    ): PublicCatalogItemCollection {
        return $this->readRepo->paginate(
            limit: $limit,
            page: $page,
            keyword: $keyword,
            viewerShopIds: $viewerShopIds,
            viewerUserId: $viewerUserId,
        );
    }
}

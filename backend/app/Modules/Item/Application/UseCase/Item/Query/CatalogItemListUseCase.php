<?php

namespace App\Modules\Item\Application\UseCase\Item\Query;

use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Reaction\Domain\Repository\FavoriteRepository;
use App\Modules\Item\Application\Dto\Item\ListItemsInputDto;
use App\Modules\Item\Application\Dto\Item\ListItemsOutputDto;
use App\Modules\Item\Application\Assembler\PublicItemAssembler;
use App\Modules\Reaction\Domain\ValueObject\ReactorId;
use App\Modules\Reaction\Domain\ValueObject\FavoriteTargetId;

final class CatalogItemListUseCase
{
    public function __construct(
        private ItemRepository $itemRepository,
        private FavoriteRepository $favoriteRepository,
    ) {
    }

    public function execute(ListItemsInputDto $input): ListItemsOutputDto
    {
        // ✅ 自分の shopId を除外
        $paginator = $this->itemRepository->searchPublicPaginator(
            limit: $input->limit,
            page: $input->page,
            keyword: null,
            excludeShopIds: $input->viewerShopIds,
        );

        $items = collect($paginator->items())->map(function ($model) use ($input) {

            $favoritesCount = $this->favoriteRepository->countByTarget(
                new FavoriteTargetId($model->id)
            );

            $isFavorited = $input->viewerUserId
                ? $this->favoriteRepository->exists(
                    new ReactorId($input->viewerUserId),
                    new FavoriteTargetId($model->id)
                )
                : false;

            return PublicItemAssembler::fromEloquent(
                model: $model,
                viewerUserId: $input->viewerUserId,
                viewerShopIds: $input->viewerShopIds,
                isFavorited: $isFavorited,
                favoritesCount: $favoritesCount,
            );
        });

        return new ListItemsOutputDto(
            items: $items->all(),
            currentPage: $paginator->currentPage(),
            total: $paginator->total(),
            hasNext: $paginator->hasMorePages(),
        );
    }
}

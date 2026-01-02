<?php

namespace App\Modules\Search\Application\UseCase\Query;

use App\Modules\Search\Domain\Repository\ItemSearchRepository;
use App\Modules\Search\Domain\Collection\SearchItems;


final class SearchItemListUseCase
{
    public function __construct(
        private ItemRepository $itemRepository,
        private FavoriteRepository $favoriteRepository,
    ) {
    }

    public function execute(ListItemsInputDto $input): ListItemsOutputDto
    {
        $paginator = $this->itemRepository->searchPublicPaginator(
            limit: $input->limit,
            page: $input->page,
            keyword: $input->keyword,
            excludeShopIds: $input->viewerShopIds, // ★ ここ
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

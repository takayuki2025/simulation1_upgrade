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
        // ❌ Repository では除外しない
        $paginator = $this->itemRepository->searchPublicPaginator(
            limit: $input->limit,
            page: $input->page,
            keyword: null,
            excludeShopIds: [], // ← ★ ここ重要
        );

        $items = collect($paginator->items())->map(function ($model) use ($input) {

            \Log::info('[Catalog][Row check]', [
                'item_id' => $model->id,
                'shop_id' => $model->shop_id,
                'item_origin' => $model->item_origin,
                'viewerShopIds' => $input->viewerShopIds,
            ]);

            // ✅ 除外条件はここで厳密に
            if (
                $model->item_origin === 'SHOP_MANAGED'
                && $model->shop_id !== null
                && in_array($model->shop_id, $input->viewerShopIds, true)
            ) {
                \Log::info('[Catalog][Excluded SHOP_MANAGED]', [
                    'item_id' => $model->id,
                ]);
                return null;
            }

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
        })
        ->filter() // ← null を落とす
        ->values();

        return new ListItemsOutputDto(
            items: $items->all(),
            currentPage: $paginator->currentPage(),
            total: $paginator->total(),
            hasNext: $paginator->hasMorePages(),
        );
    }
}

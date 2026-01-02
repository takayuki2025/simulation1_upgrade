<?php

namespace App\Modules\Item\Application\UseCase\Item\Query;

use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Application\Dto\Item\{
    ListItemsInputDto,
    ListItemsOutputDto
};
use App\Modules\Item\Application\Assembler\PublicItemAssembler;
use App\Modules\Reaction\Domain\Repository\FavoriteRepository;
use App\Modules\Reaction\Domain\ValueObject\{
    ReactorId,
    FavoriteTargetId
};
use App\Modules\Item\Domain\Factory\ItemFactory;

final class SearchItemListUseCase
{
    public function __construct(
        private ItemRepository $itemRepository,
        private FavoriteRepository $favoriteRepository,
    ) {
    }

    public function execute(ListItemsInputDto $input): ListItemsOutputDto
    {
        /* =========================================
         * 1. 検索（Infrastructure → Eloquent）
         * ========================================= */
        $paginator = $this->itemRepository->searchPublicPaginator(
            limit: $input->limit,
            page: $input->page,
            keyword: $input->keyword,
        );

        /* =========================================
         * 2. Item 正規化 + 表示用 DTO 生成
         * ========================================= */
        $items = collect($paginator->items())
            ->map(function ($eloquentItem) use ($input) {

                // Domain Item に変換（SoT）
                $domainItem = ItemFactory::fromEloquent($eloquentItem);

                // いいね数
                $favoritesCount = $this->favoriteRepository->countByTarget(
                    new FavoriteTargetId($domainItem->id())
                );

                // viewer がいる場合のみ判定
                $isFavorited = $input->viewerUserId
                    ? $this->favoriteRepository->exists(
                        new ReactorId($input->viewerUserId),
                        new FavoriteTargetId($domainItem->id())
                    )
                    : false;

                return PublicItemAssembler::fromItem(
                    item: $domainItem,
                    displayType: null,
                    viewerUserId: $input->viewerUserId,
                    viewerShopIds: $input->viewerShopIds,
                    isFavorited: $isFavorited,
                    favoritesCount: $favoritesCount,
                );
            });

        /* =========================================
         * 3. Output DTO
         * ========================================= */
        return new ListItemsOutputDto(
            items: $items->values()->all(),
            currentPage: $paginator->currentPage(),
            total: $paginator->total(),
            hasNext: $paginator->hasMorePages(),
        );
    }
}

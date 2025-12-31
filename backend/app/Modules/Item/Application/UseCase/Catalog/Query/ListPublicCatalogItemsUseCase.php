<?php

namespace App\Modules\Item\Application\UseCase\Catalog\Query;

use App\Modules\Item\Infrastructure\Persistence\Query\PublicCatalogItemReadRepository;
use App\Modules\Item\ReadModel\PublicCatalog\PublicCatalogItemCollection;
use App\Modules\Item\ReadModel\PublicCatalog\PublicCatalogItemDto;

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
        array $viewerShopIds,
        ?int $viewerUserId
    ): PublicCatalogItemCollection {

        \Log::info('[PublicCatalog][UseCase entered]', [
            'limit' => $limit,
            'page' => $page,
            'keyword' => $keyword,
            'viewerShopIds' => $viewerShopIds,
            'viewerUserId' => $viewerUserId,
        ]);


        $isShopMember = !empty($viewerShopIds);

        // ★ Repository は「生データ取得だけ」
        $rows = $this->readRepository->paginate(
            limit: $limit,
            page: $page,
            keyword: $keyword
        );

        $items = [];


        foreach ($rows as $row) {

            // ① 自分の shop 商品は除外
            if (
                $isShopMember &&
                $row->shop_id !== null &&
                in_array($row->shop_id, $viewerShopIds, true)
            ) {
                continue;
            }

            // ② 表示タイプ判定
            $displayType = null;

            if ($isShopMember && $row->shop_id === null) {
                $displayType = 'STAR';
            }

            if (
                !$isShopMember &&
                $viewerUserId !== null &&
                $row->shop_id === null &&
                $row->created_by_user_id === $viewerUserId
            ) {
                $displayType = 'COMET';
            }

            $items[] = new PublicCatalogItemDto(
                $row->id,
                $row->name,
                $row->price,
                $row->brand_primary,
                $row->condition_name,
                $row->color_name,
                $row->item_image,
                $row->created_at,
                $displayType
            );
        }


        return new PublicCatalogItemCollection($items);
    }
}

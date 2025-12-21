<?php

namespace App\Modules\Item\Application\UseCase\Item\Query;

use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Domain\Collection\Items;

/**
 * 公開用商品一覧
 * - ログインユーザー自身が出品した商品を除外する
 * - 未ログイン時は全件表示
 */


final class ListCatalogItemsUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository
    ) {
    }

    public function execute(
        int $limit,
        int $page,
        ?string $keyword,
        ?int $viewerUserId
    ): Items {
        // 🔽 ここで「意味」を確定させる
        $excludeSellerId = $viewerUserId;

        return $this->itemRepository->findPublicItems(
            limit: $limit,
            page: $page,
            keyword: $keyword,
            excludeSellerId: $excludeSellerId
        );
    }
}


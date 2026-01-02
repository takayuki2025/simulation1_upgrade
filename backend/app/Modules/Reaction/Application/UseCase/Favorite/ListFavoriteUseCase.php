<?php

namespace App\Modules\Reaction\Application\UseCase\Favorite;

use App\Modules\Reaction\Domain\Repository\FavoriteRepository;
use App\Modules\Reaction\Domain\ValueObject\{
    ReactorId,
    FavoriteTargetId
};
use App\Modules\Item\Application\Assembler\PublicItemAssembler;
use App\Modules\Item\Domain\Repository\ItemRepository;

final class ListFavoriteUseCase
{
    public function __construct(
        private FavoriteRepository $favoriteRepository,
        private ItemRepository $itemRepository,
    ) {
    }

    /**
     * @return array<int, array>
     */
    public function execute(int $viewerUserId): array
    {
        $items = $this->favoriteRepository->listItemsByUser(
            new ReactorId($viewerUserId)
        );

        return $items
            ->map(function ($item) use ($viewerUserId) {

                // Eloquent → Domain
                $domainItem = $this->itemRepository->findById($item->id);

                if (!$domainItem) {
                    return null;
                }

                $favoritesCount = $this->favoriteRepository->countByTarget(
                    new FavoriteTargetId($item->id)
                );

                return PublicItemAssembler::fromItem(
                    item: $domainItem,
                    displayType: 'FAVORITE',
                    viewerUserId: $viewerUserId,
                    viewerShopIds: [],
                    isFavorited: true,
                    favoritesCount: $favoritesCount,
                )->toArray();

            })
            ->filter()   // null 除去
            ->values()   // index 再採番
            ->all();     // ← 最後に array にする
    }
}

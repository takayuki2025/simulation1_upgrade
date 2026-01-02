<?php

namespace App\Modules\Reaction\Application\UseCase\Favorite;

use App\Modules\Reaction\Domain\Repository\FavoriteRepository;
use App\Modules\Item\Application\Assembler\PublicItemAssembler;
use App\Modules\Reaction\Domain\ValueObject\ReactorId;
use App\Modules\Reaction\Domain\ValueObject\FavoriteTargetId;

final class ListFavoriteUseCase
{
    public function __construct(
        private FavoriteRepository $favoriteRepository,
    ) {
    }

    public function execute(int $viewerUserId): array
    {
        $items = $this->favoriteRepository->listItemsByUser(
            new ReactorId($viewerUserId)
        );

        return collect($items)->map(function ($item) use ($viewerUserId) {

            $favoritesCount = $this->favoriteRepository->countByTarget(
                new FavoriteTargetId($item->id)
            );

            return PublicItemAssembler::fromEloquent(
                model: $item,
                viewerUserId: $viewerUserId,
                viewerShopIds: [],
                isFavorited: true,
                favoritesCount: $favoritesCount,
            );
        })->values()->all();
    }
}

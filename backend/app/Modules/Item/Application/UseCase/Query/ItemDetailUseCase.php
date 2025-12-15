<?php

namespace App\Modules\Item\Application\UseCase\Query;

use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Application\Dto\Item\ItemDetailOutputDto;
use RuntimeException;
use App\Modules\Item\Application\Dto\Item\ItemDetailViewDto;
use App\Modules\Reaction\Application\UseCase\Favorite\IsFavoritedUseCase;
use App\Modules\Reaction\Application\UseCase\Favorite\CountFavoritesUseCase;
use App\Modules\Comment\Application\UseCase\ListItemCommentsUseCase;


final class ItemDetailUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
        private readonly IsFavoritedUseCase $isFavorited,
        private readonly CountFavoritesUseCase $countFavorites,
        private readonly ListItemCommentsUseCase $listComments,
    ) {
    }

    public function execute(
    int $itemId,
    ?int $viewerUserId
): ItemDetailOutputDto {
    $item = $this->itemRepository->findById($itemId);

    if (!$item) {
        throw new RuntimeException('Item not found');
    }

    return new ItemDetailOutputDto(
        item: $item,
        comments: $this->listComments->execute($itemId),
        isFavorited: $viewerUserId
            ? $this->isFavorited->execute($viewerUserId, $itemId)
            : false,
        favoritesCount: $this->countFavorites->execute($itemId),
    );
}
}
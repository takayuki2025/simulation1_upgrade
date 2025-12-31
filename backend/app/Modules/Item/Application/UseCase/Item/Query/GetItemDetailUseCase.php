<?php

namespace App\Modules\Item\Application\UseCase\Item\Query;

use App\Modules\Item\Application\Dto\Item\ItemDetailOutputDto;
use App\Modules\Item\Infrastructure\Persistence\Query\ItemReadRepository;
use App\Modules\Reaction\Application\UseCase\Favorite\IsFavoritedUseCase;
use App\Modules\Reaction\Application\UseCase\Favorite\CountFavoritesUseCase;
use App\Modules\Comment\Application\UseCase\ListItemCommentsUseCase;
use RuntimeException;

final class GetItemDetailUseCase
{
    public function __construct(
        private readonly ItemReadRepository $itemReadRepository,
        private readonly IsFavoritedUseCase $isFavorited,
        private readonly CountFavoritesUseCase $countFavorites,
        private readonly ListItemCommentsUseCase $listComments,
    ) {
    }

    public function execute(
        int $itemId,
        ?int $viewerUserId
    ): ItemDetailOutputDto {

        // 🔍 ReadModel（display_brand / condition / color 含む）
        $itemRow = $this->itemReadRepository
            ->findWithDisplayEntities($itemId);

        if (!$itemRow) {
            throw new RuntimeException('Item not found');
        }

        // 💬 コメント
        $comments = $this->listComments->execute($itemId);

        // ❤️ お気に入り
        $isFavorited = $viewerUserId
            ? $this->isFavorited->execute($itemId, $viewerUserId)
            : false;

        $favoritesCount = $this->countFavorites->execute($itemId);

        return new ItemDetailOutputDto(
            item: $itemRow,
            comments: $comments,
            isFavorited: $isFavorited,
            favoritesCount: $favoritesCount,
        );
    }
}

<?php

namespace App\Modules\Item\Presentation\Application\UseCase\Favorite;

use App\Modules\Item\Presentation\Domain\Repository\ItemRepository;

class ListFavoriteUseCase
{
    public function __construct(
        private readonly ItemRepository $items
    ) {
    }

    /**
     * お気に入り一覧（ユーザーごと）
     */
    public function execute(int $userId): iterable
    {
        return $this->items->listByCartUser($userId);
    }
}

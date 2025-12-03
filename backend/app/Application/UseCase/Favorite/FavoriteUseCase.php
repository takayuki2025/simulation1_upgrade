<?php

namespace App\Application\UseCase\Favorite;

use App\Domain\Repository\FavoriteRepository;

class FavoriteUseCase
{
    public function __construct(private FavoriteRepository $favorites)
    {
    }

    /** いいね登録/解除トグル */
    public function toggle(int $userId, int $itemId): bool
    {
        return $this->favorites->toggle($userId, $itemId);
    }

    /** いいねの存在チェック */
    public function isFavorited(int $userId, int $itemId): bool
    {
        return $this->favorites->exists($userId, $itemId);
    }

    /** 特定ユーザーのいいね一覧 */
    public function listByUser(int $userId): array
    {
        return $this->favorites->findByUser($userId);
    }
}

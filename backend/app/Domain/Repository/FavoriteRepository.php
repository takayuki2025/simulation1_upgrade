<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Favorite;

interface FavoriteRepository
{
    public function toggle(int $userId, int $itemId): bool;

    public function exists(int $userId, int $itemId): bool;

    public function findByUser(int $userId): array;
}

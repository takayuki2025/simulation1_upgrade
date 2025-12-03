<?php

namespace App\Infrastructure\Persistence;

use App\Domain\Repository\FavoriteRepository;
use App\Domain\Entity\Favorite;
use App\Models\Good;

class EloquentFavoriteRepository implements FavoriteRepository
{
    public function toggle(int $userId, int $itemId): bool
    {
        $exists = Good::where('user_id', $userId)
            ->where('item_id', $itemId)
            ->first();

        if ($exists) {
            $exists->delete();
            return false; // いいね解除
        }

        Good::create([
            'user_id' => $userId,
            'item_id' => $itemId,
        ]);

        return true; // いいね登録
    }

    public function exists(int $userId, int $itemId): bool
    {
        return Good::where('user_id', $userId)
            ->where('item_id', $itemId)
            ->exists();
    }

    public function findByUser(int $userId): array
    {
        return Good::where('user_id', $userId)
            ->get()
            ->map(fn ($g) => new Favorite(
                id: $g->id,
                userId: $g->user_id,
                itemId: $g->item_id
            ))
            ->all();
    }
}

<?php

namespace App\Modules\Reaction\Infrastructure\Persistence;

use App\Models\Good;
use App\Modules\Reaction\Domain\Entity\Favorite;
use App\Modules\Reaction\Domain\Repository\FavoriteRepository;
use App\Modules\Reaction\Domain\ValueObject\ReactorId;
use App\Modules\Reaction\Domain\ValueObject\FavoriteTargetId;

final class EloquentFavoriteRepository implements FavoriteRepository
{
    public function add(Favorite $favorite): void
    {
        // 既に存在するなら何もしない（冪等性）。厳密にしたければ例外に変更可。
        Good::query()->firstOrCreate([
            'user_id' => $favorite->reactorId()->value(),
            'item_id' => $favorite->targetId()->value(),
        ], [
            'shop_id' => $favorite->shopId(),
        ]);
    }

    public function remove(ReactorId $reactorId, FavoriteTargetId $targetId): void
    {
        Good::query()
            ->where('user_id', $reactorId->value())
            ->where('item_id', $targetId->value())
            ->delete();
    }

    public function exists(ReactorId $reactorId, FavoriteTargetId $targetId): bool
    {
        return Good::query()
            ->where('user_id', $reactorId->value())
            ->where('item_id', $targetId->value())
            ->exists();
    }

    public function countByTarget(FavoriteTargetId $targetId): int
    {
        return Good::query()
            ->where('item_id', $targetId->value())
            ->count();
    }

    public function listItemsByUser(ReactorId $reactorId): iterable
    {
        // 既存の ItemRepository::listByCartUser 相当をここでやるか、
        // Item を join / eager load する。今回は最低限「item を返せる」形で eager load。
        return Good::query()
            ->with('item') // Good::item() リレーション前提
            ->where('user_id', $reactorId->value())
            ->latest()
            ->get()
            ->map(fn (Good $good) => $good->item);
    }
}

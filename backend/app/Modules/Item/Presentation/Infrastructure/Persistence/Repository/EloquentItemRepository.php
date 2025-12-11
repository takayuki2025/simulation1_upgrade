<?php

namespace App\Modules\Item\Presentation\Infrastructure\Persistence\Repository;

use App\Models\Item as EloquentItem;
use App\Models\Good;
use App\Models\Comment;
use App\Modules\Item\Presentation\Domain\Entity\Item;
use App\Modules\Item\Presentation\Domain\Repository\ItemRepository;
use App\Modules\Item\Presentation\Domain\ValueObject\ItemId;
use App\Modules\Item\Presentation\Domain\ValueObject\Price;
use App\Modules\Item\Presentation\Domain\ValueObject\StockCount;
use App\Modules\Item\Presentation\Domain\ValueObject\CategoryList;
use App\Modules\Item\Presentation\Domain\ValueObject\ItemImagePath;

class EloquentItemRepository implements ItemRepository
{
    private function toDomain(EloquentItem $model): Item
    {
        return new Item(
            id: $model->id ? new ItemId($model->id) : null,

            // ★ ここは「元のままの int」を渡す
            userId: $model->user_id,
            shopId: $model->shop_id,
            name: $model->name,
            price: new Price($model->price),
            explain: $model->explain,
            condition: $model->condition,

            // ★ ここも、最初に動いていた形に戻す
            //   CategoryList 側で string / array をうまく扱っている想定
            category: new CategoryList($model->category ?? []),
            brand: $model->brand,
            itemImage: new ItemImagePath($model->item_image),
            remain: new StockCount($model->remain),
        );
    }

    public function listAll(?string $search, ?int $excludeUserId): iterable
    {
        $query = EloquentItem::query()->with('user');

        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        if ($excludeUserId) {
            $query->where('user_id', '!=', $excludeUserId);
        }

        return $query->orderByDesc('id')
            ->get()
            ->map(fn (EloquentItem $m) => $this->toDomain($m));
    }

    public function findById(int $id): ?Item
    {
        $model = EloquentItem::with('user')->find($id);
        if (!$model) {
            return null;
        }
        return $this->toDomain($model);
    }

    public function save(Item $item): Item
    {
        $id = $item->getId()?->getValue();

        $model = $id ? EloquentItem::findOrFail($id) : new EloquentItem();
        $model = (new \App\Modules\Item\Infrastructure\Mapper\ItemMapper())->toEloquent($item, $model);
        $model->save();

        return $this->toDomain($model);
    }

    public function delete(int $id): void
    {
        EloquentItem::destroy($id);
    }

    public function listByShop(int $shopId): iterable
    {
        return EloquentItem::where('shop_id', $shopId)
            ->orderByDesc('id')
            ->get()
            ->map(fn (EloquentItem $m) => $this->toDomain($m));
    }

    public function listByCartUser(int $userId): iterable
    {
        return EloquentItem::whereHas('usersInCart', function ($q) use ($userId) {
            $q->where('users.id', $userId);
        })
            ->get()
            ->map(fn (EloquentItem $m) => $this->toDomain($m));
    }

    public function updateStock(int $itemId, int $newRemain): void
    {
        EloquentItem::whereKey($itemId)->update(['remain' => $newRemain]);
    }

    public function getStock(int $itemId): ?int
    {
        return EloquentItem::whereKey($itemId)->value('remain');
    }

    public function toggleMylist(int $userId, int $itemId): bool
    {
        $exists = Good::where('user_id', $userId)
            ->where('item_id', $itemId)
            ->first();

        if ($exists) {
            $exists->delete();
            return false; // OFF
        }

        Good::create([
            'user_id' => $userId,
            'item_id' => $itemId,
        ]);

        return true; // ON
    }

    public function getFavoriteCount(int $itemId): int//⚫️
    {
        return Good::where('item_id', $itemId)->count();
    }

    public function findComments(int $itemId): array
    {
        // listComments() を使えばOK
        return $this->listComments($itemId)->toArray();
    }

    public function isFavorited(int $itemId, int $userId): bool
    {
        return \App\Models\Good::where('item_id', $itemId)
            ->where('user_id', $userId)
            ->exists();
    }

    public function favoritesCount(int $itemId): int
    {
        return \App\Models\Good::where('item_id', $itemId)->count();
    }

    public function listComments(int $itemId): iterable//⚫️
    {
        return Comment::where('item_id', $itemId)
            ->orderByDesc('id')
            ->get();
    }

    public function searchByCategory(array $categories): iterable
    {
        $query = EloquentItem::query();

        foreach ($categories as $category) {
            $query->whereJsonContains('category', $category);
        }

        return $query->orderByDesc('id')
            ->get()
            ->map(fn (EloquentItem $m) => $this->toDomain($m));
    }

    public function searchByBrand(string $brand): iterable
    {
        return EloquentItem::where('brand', 'LIKE', "%{$brand}%")
            ->orderByDesc('id')
            ->get()
            ->map(fn (EloquentItem $m) => $this->toDomain($m));
    }
}

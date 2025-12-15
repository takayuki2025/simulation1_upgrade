<?php

namespace App\Modules\Item\Infrastructure\Persistence\Repository;

use App\Models\Good;
use App\Models\Comment;
use App\Models\Item as EloquentItem;
use App\Modules\Item\Domain\Collection\Items;
use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Domain\ValueObject\{
    ItemId,
    Price,
    StockCount,
    CategoryList,
    ItemImagePath
};

final class EloquentItemRepository implements ItemRepository
{
    private function toDomain(EloquentItem $model): Item
    {
        return new Item(
            id: new ItemId($model->id),
            userId: $model->user_id,
            shopId: $model->shop_id,
            name: $model->name,
            price: new Price($model->price),
            explain: $model->explain,
            condition: $model->condition,
            category: new CategoryList($model->category ?? []),
            brand: $model->brand,
            itemImage: ItemImagePath::fromRaw($model->item_image),
            remain: new StockCount($model->remain),
        );
    }

    /**
     * 一覧取得
     */
    public function findAll(
        int $limit,
        int $page,
        ?string $keyword
    ): Items {
        $query = EloquentItem::query();

        if ($keyword) {
            $query->where('name', 'LIKE', "%{$keyword}%");
        }

        return Items::fromEloquent(
            $query
                ->orderByDesc('id')
                ->limit($limit)
                ->offset(($page - 1) * $limit)
                ->get()
        );
    }

    /**
     * キーワード検索
     */
    public function searchByKeyword(string $keyword): Items
    {
        $items = EloquentItem::where('name', 'LIKE', "%{$keyword}%")
            ->orderByDesc('id')
            ->get()
            ->map(fn (EloquentItem $m) => $this->toDomain($m))
            ->all();

        return Items::fromArray($items);
    }

    /**
     * ★ 今回不足していたメソッド
     * 単体取得
     */
    public function findById(int $id): ?Item
    {
        $model = EloquentItem::find($id);

        return $model
            ? $this->toDomain($model)
            : null;
    }

    public function listComments(int $itemId): array
    {
        return Comment::with('user')
            ->where('item_id', $itemId)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'comment' => $comment->comment,
                    'created_at' => $comment->created_at,
                    'user' => [
                        'id' => $comment->user->id,
                        'name' => $comment->user->name,
                        'user_image' => $comment->user->user_image,
                    ],
                ];
            })
            ->toArray();
    }

    public function favoritesCount(int $itemId): int
    {
        return Good::where('item_id', $itemId)->count();
    }

    /**
     * ユーザーがお気に入り済みか
     */
    public function isFavorited(int $itemId, int $userId): bool
    {
        return Good::where('item_id', $itemId)
            ->where('user_id', $userId)
            ->exists();
    }
}


//     public function findById(int $id): ?Item
//     {
//         $model = EloquentItem::with('user')->find($id);
//         if (!$model) {
//             return null;
//         }
//         return $this->toDomain($model);
//     }

//     public function save(Item $item): Item
//     {
//         $id = $item->getId()?->getValue();

//         $model = $id ? EloquentItem::findOrFail($id) : new EloquentItem();
//         $model = (new \App\Modules\Item\Infrastructure\Mapper\ItemMapper())->toEloquent($item, $model);
//         $model->save();

//         return $this->toDomain($model);
//     }

//     public function delete(int $id): void
//     {
//         EloquentItem::destroy($id);
//     }

//     public function listByShop(int $shopId): iterable
//     {
//         return EloquentItem::where('shop_id', $shopId)
//             ->orderByDesc('id')
//             ->get()
//             ->map(fn (EloquentItem $m) => $this->toDomain($m));
//     }

//     public function listByCartUser(int $userId): iterable
//     {
//         return EloquentItem::whereHas('usersInCart', function ($q) use ($userId) {
//             $q->where('users.id', $userId);
//         })
//             ->get()
//             ->map(fn (EloquentItem $m) => $this->toDomain($m));
//     }

//     public function updateStock(int $itemId, int $newRemain): void
//     {
//         EloquentItem::whereKey($itemId)->update(['remain' => $newRemain]);
//     }

//     public function getStock(int $itemId): ?int
//     {
//         return EloquentItem::whereKey($itemId)->value('remain');
//     }

//     /* =======================
//        いいね（マイリスト）
//     ======================== */
//     public function toggleMylist(int $userId, int $itemId): bool
//     {
//         $exists = Good::where('user_id', $userId)
//             ->where('item_id', $itemId)
//             ->first();

//         if ($exists) {
//             $exists->delete();
//             return false; // OFF
//         }

//         Good::create([
//             'user_id' => $userId,
//             'item_id' => $itemId,
//         ]);

//         return true; // ON
//     }

//     public function getFavoriteCount(int $itemId): int
//     {
//         return Good::where('item_id', $itemId)->count();
//     }

//     // ★ 追加：詳細画面用 favoritesCount
//     public function favoritesCount(int $itemId): int
//     {
//         return Good::where('item_id', $itemId)->count();
//     }

//     // ★ 追加：ユーザーがいいね済みか？
//     public function isFavorited(int $itemId, int $userId): bool
//     {
//         return Good::where('item_id', $itemId)
//             ->where('user_id', $userId)
//             ->exists();
//     }

//     /* =======================
//        コメント一覧
//     ======================== */

//     /** コメント一覧を返す */
//     public function findComments(int $itemId): array
//     {
//         return Comment::with('user')
//             ->where('item_id', $itemId)
//             ->orderBy('created_at', 'desc')
//             ->get()
//             ->toArray();
//     }

//     public function listComments(int $itemId): iterable
//     {
//         return Comment::where('item_id', $itemId)
//             ->with('user')  // ← フロントで user.name / user.user_image を使うので
//             ->orderByDesc('id')
//             ->get();
//     }

//     public function searchByCategory(array $categories): iterable
//     {
//         $query = EloquentItem::query();

//         foreach ($categories as $category) {
//             $query->whereJsonContains('category', $category);
//         }

//         return $query->orderByDesc('id')
//             ->get()
//             ->map(fn (EloquentItem $m) => $this->toDomain($m));
//     }

//     public function searchByBrand(string $brand): iterable
//     {
//         return EloquentItem::where('brand', 'LIKE', "%{$brand}%")
//             ->orderByDesc('id')
//             ->get()
//             ->map(fn (EloquentItem $m) => $this->toDomain($m));
//     }

//     public function createComment(int $userId, int $itemId, string $comment): array
//     {
//         $model = \App\Models\Comment::create([
//             'user_id' => $userId,
//             'item_id' => $itemId,
//             'comment' => $comment,
//         ]);

//         return $model->toArray();
//     }

//     public function updateRemainWithLock(int $itemId, int $newRemain): void
//     {
//         DB::transaction(function () use ($itemId, $newRemain) {
//             /** @var ItemModel $row */
//             $row = ItemModel::where('id', $itemId)->lockForUpdate()->firstOrFail();

//             $row->remain = $newRemain;
//             $row->save();
//         });
//     }
// }

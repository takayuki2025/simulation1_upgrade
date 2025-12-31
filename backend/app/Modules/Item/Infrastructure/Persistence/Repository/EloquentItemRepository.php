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
    Money,
    StockCount,
    CategoryList,
    ItemImagePath
};

final class EloquentItemRepository implements ItemRepository
{
    /**
     * Eloquent -> Domain 変換
     */
    private function toDomain(EloquentItem $model): Item
    {
        $categories = $model->category ?? [];

        if (is_string($categories)) {
            $decoded = json_decode($categories, true);
            $categories = is_array($decoded) ? $decoded : [];
        }

        $imagePath = null;
        if (! empty($model->item_image)) {
            $imagePath = ItemImagePath::fromRaw($model->item_image);
        }

        return Item::reconstitute(
            id: new ItemId($model->id),
            itemOrigin: $model->item_origin,
            shopId: $model->shop_id,
            createdByUserId: $model->created_by_user_id,
            name: $model->name,
            price: new Money((int) $model->price, 'JPY'),
            explain: (string) $model->explain,
            condition: (string) $model->condition,
            category: new CategoryList($categories),
            itemImage: $imagePath,
            remain: new StockCount((int) $model->remain),
        );
    }

    public function findById(int $id): ?Item
    {
        $model = EloquentItem::find($id);

        return $model ? $this->toDomain($model) : null;
    }

    /**
     * Item を保存（create / update 両対応）
     */
    public function save(Item $item): ItemId
    {
        $existingId = $item->getId();

        if ($existingId instanceof ItemId) {
            $model = EloquentItem::query()->find($existingId->getValue())
                ?? new EloquentItem();
        } else {
            $model = new EloquentItem();
        }

        // ==================================================
        // ✅ Fact only（ここが重要）
        // - shop_id / created_by_user_id が「事実」
        // - item_origin は Domain には持たせない
        // ==================================================

        $model->item_origin = $item->getItemOrigin();

        $model->shop_id = $item->getShopId();
        $model->created_by_user_id = $item->getCreatedByUserId();

        $model->name = $item->getName();
        $model->price = $item->getPrice()->amount();
        $model->explain = $item->getExplain();
        $model->condition = $item->getCondition();

        $model->category = json_encode(
            $item->getCategory()->toArray(),
            JSON_UNESCAPED_UNICODE
        );

        $model->item_image = $item->getItemImage()?->value();
        $model->remain = $item->getRemain()->getValue();

        $model->save();

        return new ItemId($model->id);
    }

    /* ===== Query 系 ===== */

    public function favoritesCount(int $itemId): int
    {
        return Good::where('item_id', $itemId)->count();
    }

    public function isFavorited(int $itemId, int $userId): bool
    {
        return Good::where('item_id', $itemId)
            ->where('user_id', $userId)
            ->exists();
    }

    /**
     * Public 用（Domain）
     * ※ 現時点では item_origin は使わない
     * ※ excludeShopId が指定されている場合のみ、その shop の商品を除外する（既存仕様維持）
     */
    public function findPublicItems(
        int $limit,
        int $page,
        ?string $keyword,
        ?int $excludeShopId
    ): Items {
        $query = EloquentItem::query();

        if ($keyword) {
            $query->where('name', 'LIKE', "%{$keyword}%");
        }

        if ($excludeShopId !== null) {
            $query->where(function ($q) use ($excludeShopId) {
                $q->whereNull('shop_id')
                  ->orWhere('shop_id', '!=', $excludeShopId);
            });
        }

        $models = $query
            ->orderByDesc('created_at')
            ->limit($limit)
            ->offset(($page - 1) * $limit)
            ->get();

        return Items::fromEloquent($models);
    }

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

    public function searchPublic(
        int $limit,
        int $page,
        ?string $keyword,
        ?int $viewerUserId,
    ): Items {
        $query = EloquentItem::query();

        if ($keyword) {
            $query->where('name', 'like', "%{$keyword}%");
        }

        $paginator = $query
            ->orderByDesc('created_at')
            ->paginate($limit, ['*'], 'page', $page);

        return Items::fromEloquent(
            collect($paginator->items())
        );
    }

    public function searchByKeyword(string $keyword): Items
    {
        $items = EloquentItem::where('name', 'LIKE', "%{$keyword}%")
            ->orderByDesc('id')
            ->get()
            ->map(fn (EloquentItem $m) => $this->toDomain($m))
            ->all();

        return Items::fromArray($items);
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

    public function nextIdentity(): ItemId
    {
        return ItemId::generate();
    }

    public function updateItemImage(
        ItemId $itemId,
        ItemImagePath $imagePath
    ): void {
        EloquentItem::query()
            ->where('id', $itemId->getValue())
            ->update([
                'item_image' => $imagePath->value(),
                'updated_at' => now(),
            ]);
    }

    public function findPublicByShopId(int $shopId): array
    {
        return EloquentItem::query()
            ->where('shop_id', $shopId)
            ->orderByDesc('id')
            ->get()
            ->map(fn (EloquentItem $m) => $this->toDomain($m))
            ->all();
    }
}

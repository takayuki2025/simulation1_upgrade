<?php

namespace App\Modules\Item\Infrastructure\Persistence\Repository;

use App\Models\Good;
use App\Models\Comment;
use App\Models\Item as EloquentItem;
use App\Modules\Item\Domain\Collection\Items;
use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Domain\Repository\ItemRepository;
use Illuminate\Support\Facades\DB;
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
     *
     * - category: DB は JSON(string) の可能性があるので array に戻す
     * - item_image: null の可能性があるので安全に扱う
     */
    private function toDomain(EloquentItem $model): Item
    {
        $categories = $model->category ?? [];

        if (is_string($categories)) {
            $decoded = json_decode($categories, true);
            $categories = is_array($decoded) ? $decoded : [];
        }

        $imagePath = null;
        if (!empty($model->item_image)) {
            $imagePath = ItemImagePath::fromRaw($model->item_image);
        }

        return Item::reconstitute(
            new ItemId($model->id),
            $model->shop_id,
            $model->name,
            new Money($model->price, 'JPY'),
            $model->explain,
            $model->condition,
            new CategoryList($categories),
            $imagePath,
            new StockCount($model->remain),
        );
    }

    public function findById(int $id): ?Item
    {
        $model = EloquentItem::find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * Item を保存（create / update 両対応）
     *
     * - category: array を JSON にして保存
     * - item_image: null 安全
     * - id があるなら update / ないなら insert（重複保存を防ぐ）
     */
    public function save(Item $item): ItemId
    {
        // ✅ id がある場合は update を優先（同じ商品が2行作られる事故を防ぐ）
        $existingId = method_exists($item, 'getId') ? $item->getId() : null;

        /** @var EloquentItem $model */
        if ($existingId instanceof ItemId) {
            $model = EloquentItem::query()->find($existingId->getValue()) ?? new EloquentItem();
        } else {
            $model = new EloquentItem();
        }

        $model->shop_id = $item->getShopId();
        $model->name = $item->getName();
        $model->price = $item->getPrice()->amount();
        // $model->brand = $item->getBrand();
        $model->explain = $item->getExplain();
        $model->condition = $item->getCondition();

        // ✅ DB は JSON(string) を期待（itemsテーブルの設計に合わせる）
        $model->category = json_encode(
            $item->getCategory()->toArray(),
            JSON_UNESCAPED_UNICODE
        );

        // ✅ item_image が null の可能性に対応
        $model->item_image = $item->getItemImage()?->value();

        $model->remain = $item->getRemain()->getValue();

        $model->save();

        return new ItemId($model->id);
    }

    /* ===== 既存の Query 系 ===== */

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

    public function findPublicItems(
        int $limit,
        int $page,
        ?string $keyword,
        ?int $excludeSellerId
    ): Items {
        $query = EloquentItem::query()
            ->where('status', 'published'); // ← ※あなたのDBに status が無いならここは必ず消す/修正

        if ($keyword) {
            $query->where('name', 'LIKE', "%{$keyword}%");
        }

        if ($excludeSellerId !== null) {
            $query->where('user_id', '!=', $excludeSellerId);
            // ※ shop_id 出品に切り替える場合はここを変更
        }

        $models = $query
            ->orderByDesc('created_at')
            ->limit($limit)
            ->offset(($page - 1) * $limit)
            ->get();

        return Items::fromEloquent($models);
    }

    /**
     * 一覧取得統合
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

        if ($viewerUserId) {
            $query->where('user_id', '!=', $viewerUserId);
        }

        $paginator = $query
            ->orderByDesc('created_at')
            ->paginate($limit, ['*'], 'page', $page);

        return Items::fromEloquent(
            collect($paginator->items())
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

    public function findWithDisplayBrand(int $itemId)
    {
        // ※このメソッドは Item::query() になっていて、Domain Entity と衝突しがちです。
        // ただし、今回は「極力削除しない」方針なので触らずに残します。
        return \App\Models\Item::query()
            ->leftJoin('item_entities', 'items.id', '=', 'item_entities.item_id')
            ->where('items.id', $itemId)
            ->select([
                'items.*',
                DB::raw('COALESCE(brand_entities.canonical_name, items.brand) as display_brand'),
            ])
            ->first();
    }

    public function paginateWithDisplayBrand(int $perPage = 20)
    {
        return \App\Models\Item::query()
            ->leftJoin('item_entities', 'items.id', '=', 'item_entities.item_id')
            ->select([
                'items.*',
                DB::raw('COALESCE(brand_entities.canonical_name, items.brand) as display_brand'),
            ])
            ->paginate($perPage);
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
            // ->where('is_public', true)
            ->orderByDesc('id')
            ->get()
            ->map(fn (EloquentItem $m) => $this->toDomain($m))
            ->all();
    }
}

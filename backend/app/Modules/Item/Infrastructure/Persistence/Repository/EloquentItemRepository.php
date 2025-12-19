<?php

namespace App\Modules\Item\Infrastructure\Persistence\Repository;

use App\Models\Good;
use App\Models\Comment;
use App\Models\Item as EloquentItem;
use App\Modules\Item\Domain\Collection\Items;
use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Infrastructure\Eloquent\Models\Item as ItemModel;
use App\Modules\Item\Domain\Repository\ItemRepository;
use Illuminate\Support\Facades\DB;
use App\Modules\Item\Domain\ValueObject\{
    ItemId,
    Money,
    StockCount,
    CategoryList,
    ItemImagePath,
    SellerType
};

final class EloquentItemRepository implements ItemRepository
{
    private function toDomain(EloquentItem $model): Item
    {
        return new Item(
            id: new ItemId($model->id),
            shopId: $model->shop_id,   // ★ userId 削除
            name: $model->name,
            price: new Money($model->price, 'JPY'),
            explain: $model->explain,
            condition: $model->condition,
            category: new CategoryList($model->category ?? []),
            brand: $model->brand,
            itemImage: ItemImagePath::fromRaw($model->item_image),
            remain: new StockCount($model->remain),
        );
    }

    public function findById(int $id): ?Item
    {
        $model = EloquentItem::find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function save(Item $item): ItemId
    {
        $model = new EloquentItem();

        $model->shop_id = $item->getShopId();   // ★ これだけ
        $model->name = $item->getName();
        $model->price = $item->getPrice()->amount();
        $model->brand = $item->getBrand();
        $model->explain = $item->getExplain();
        $model->condition = $item->getCondition();
        $model->category = $item->getCategory()->toArray();
        $model->item_image = $item->getItemImage()->value();
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
        ?int $viewerUserId
    ): Items {
        $query = EloquentItem::query();

        if ($keyword) {
            $query->where('name', 'like', "%{$keyword}%");
        }

        if ($viewerUserId) {
            $query->where('user_id', '!=', $viewerUserId);
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

    /**
     * ★ 今回不足していたメソッド
     * 単体取得
     */


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
        return Item::query()
            ->leftJoin('item_entities', 'items.id', '=', 'item_entities.item_id')
            // ->leftJoin('item_entities', function ($join) {
            //     $join->on('items.id', '=', 'item_entities.item_id')
            //          ->where('item_entities.is_latest', true);
            // })
            // ->leftJoin(
            //     'brand_entities',
            //     'item_entities.brand_entity_id',
            //     '=',
            //     'brand_entities.id'
            // )
            ->where('items.id', $itemId)
            ->select([
                'items.*',
                DB::raw('COALESCE(brand_entities.canonical_name, items.brand) as display_brand'),
            ])
            ->first();
    }

    public function paginateWithDisplayBrand(int $perPage = 20)
    {
        return Item::query()
            ->leftJoin('item_entities', 'items.id', '=', 'item_entities.item_id')
            // ->leftJoin('item_entities', function ($join) {
            //     $join->on('items.id', '=', 'item_entities.item_id')
            //         ->where('item_entities.is_latest', true);
            // })
            // ->leftJoin(
            //     'brand_entities',
            //     'item_entities.brand_entity_id',
            //     '=',
            //     'brand_entities.id'
            // )
            ->select([
                'items.*',
                DB::raw('COALESCE(brand_entities.canonical_name, items.brand) as display_brand'),
            ])
            ->paginate($perPage);
    }
}

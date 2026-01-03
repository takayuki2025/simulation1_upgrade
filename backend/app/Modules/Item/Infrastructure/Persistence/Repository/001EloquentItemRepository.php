<?php

namespace App\Modules\Item\Infrastructure\Persistence\Repository;

use App\Models\Item as EloquentItem;
use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Domain\ValueObject\{
    ItemId,
    Money,
    StockCount,
    CategoryList,
    ItemImagePath,
    ItemOrigin
};
use DateTimeImmutable;

final class EloquentItemRepository implements ItemRepository
{
    /* ===============================
       Eloquent -> Domain
    =============================== */
    private function toDomain(EloquentItem $model): Item
    {
        // category は DB 側の型に揺れがある前提で吸収
        $categories = $model->category ?? [];
        if (is_string($categories)) {
            $decoded = json_decode($categories, true);
            $categories = is_array($decoded) ? $decoded : [];
        }

        $imagePath = $model->item_image
            ? ItemImagePath::fromRaw($model->item_image)
            : null;

        $publishedAt = null;
        if (!empty($model->published_at)) {
            $publishedAt = new DateTimeImmutable($model->published_at);
        }

        return Item::reconstitute(
            id: new ItemId((int)$model->id),
            itemOrigin: ItemOrigin::from((string)$model->item_origin),
            shopId: $model->shop_id !== null ? (int)$model->shop_id : null,
            createdByUserId: $model->created_by_user_id !== null ? (int)$model->created_by_user_id : null,
            name: (string)$model->name,
            price: new Money((int)$model->price, 'JPY'),
            explain: (string)($model->explain ?? ''),
            condition: (string)($model->condition ?? ''),
            category: new CategoryList($categories),
            itemImage: $imagePath,
            remain: new StockCount((int)($model->remain ?? 0)),
            publishedAt: $publishedAt,
        );
    }

    public function findById(int $id): ?Item
    {
        $model = EloquentItem::query()->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /* ===============================
       Save (Upsert)
    =============================== */
    public function save(Item $item): void
    {
        // update or insert
        $model = null;

        if ($item->getId() !== null) {
            $model = EloquentItem::query()->find($item->id());
        }

        if (!$model) {
            $model = new EloquentItem();
        }

        // Domain -> DB
        $model->item_origin = $item->getItemOrigin()->value(); // string
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

        $model->item_image = $item->getItemImage()
            ? $item->getItemImage()->value()
            : null;

        $model->remain = $item->getRemain()->toInt();

        $model->published_at = $item->getPublishedAt()
            ? $item->getPublishedAt()->format('Y-m-d H:i:s')
            : null;

        $model->save();

        // 新規時のみ ID を付与
        if ($item->getId() === null) {
            $item->setId(new ItemId((int)$model->id));
        }
    }

    public function delete(int $id): void
    {
        EloquentItem::query()->where('id', $id)->delete();
    }
}

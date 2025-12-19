<?php

namespace App\Modules\Item\Infrastructure\Persistence\Repository;

use App\Models\ItemDraft as EloquentItemDraft;
use App\Modules\Item\Domain\Entity\ItemDraft;
use App\Modules\Item\Domain\Repository\ItemDraftRepository;
use App\Modules\Item\Domain\ValueObject\{
    ItemDraftId,
    SellerId,
    ItemName,
    Money,
    BrandName,
    ItemStatus,
    CategoryList,
    ItemImagePath,
    StockCount
};

final class EloquentItemDraftRepository implements ItemDraftRepository
{
    public function nextIdentity(): ItemDraftId
    {
        return ItemDraftId::generate();
    }

    public function save(ItemDraft $draft): void
    {
        $model = EloquentItemDraft::find($draft->id()->value())
            ?? new EloquentItemDraft();

        $model->id = $draft->id()->value();

        if ($draft->sellerId()->isShop()) {
            $model->shop_id = $draft->sellerId()->id();
            $model->user_id = null;
        } else {
            $model->shop_id = null;
            $model->user_id = $draft->sellerId()->id();
        }

        $model->name       = $draft->name()->value();
        $model->price      = $draft->price()->amount();
        $model->brand      = $draft->brand()?->raw();
        $model->status     = $draft->status()->value;
        $model->explain    = $draft->explain();
        $model->condition  = $draft->condition();
        $model->category   = $draft->category()?->toArray();
        $model->remain     = $draft->remain()->getValue();

        $model->item_image = $draft->itemImage()
            ? $draft->itemImage()->value()
            : null;

        $model->save();
    }

    public function findById(string $draftId): ?ItemDraft
    {
        $model = EloquentItemDraft::find($draftId);

        if (! $model) {
            return null;
        }

        $sellerId = $model->shop_id
            ? SellerId::shop($model->shop_id)
            : SellerId::user($model->user_id);

        $draft = ItemDraft::reconstruct(
            id: ItemDraftId::restore($model->id),
            sellerId: $sellerId,
            name: new ItemName($model->name),
            price: new Money($model->price, 'JPY'),
            brandRaw: $model->brand ? new BrandName($model->brand) : null,
            status: ItemStatus::from($model->status),
            explain: $model->explain,
            condition: $model->condition,
            category: $model->category,
            remain: new StockCount($model->remain),
        );

        if ($model->item_image) {
            $draft->attachImage(
                ItemImagePath::fromRaw($model->item_image)
            );
        }

        return $draft;
    }
}

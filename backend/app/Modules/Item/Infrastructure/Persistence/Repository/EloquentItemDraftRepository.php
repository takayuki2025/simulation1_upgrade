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

        /**
         * ★ Repository は「決まった sellerId」を保存するだけ
         */
        if ($draft->sellerId()->isIndividual()) {
            $model->user_id = $draft->sellerId()->id();
            $model->shop_id = null;
        } else {
            $model->user_id = null;
            $model->shop_id = $draft->sellerId()->id();
        }

        $model->name = $draft->name()->value();
        $model->price = $draft->price()->amount();
        $model->brand = $draft->brand()?->raw();
        $model->status = $draft->status()->value;
        $model->explain = $draft->explain();
        $model->condition = $draft->condition();
        $model->category = $draft->category()->toArray();
        $model->remain = $draft->remain()->getValue();
        $model->item_image = $draft->itemImage()?->value();

        $model->save();
    }

    public function findById(string $draftId): ?ItemDraft
    {
        $model = EloquentItemDraft::find($draftId);
        if (! $model) {
            return null;
        }

        /**
         * ★ DB の事実から sellerId を復元するだけ
         */
        $sellerId = $model->shop_id !== null
            ? SellerId::shop((int) $model->shop_id)
            : SellerId::user((int) $model->user_id);

        return ItemDraft::reconstruct(
            id: ItemDraftId::restore($model->id),
            sellerId: $sellerId,
            name: new ItemName($model->name),
            price: new Money($model->price, 'JPY'),
            brandRaw: $model->brand ? new BrandName($model->brand) : null,
            status: ItemStatus::from($model->status),
            explain: $model->explain,
            condition: $model->condition,
            category: $model->category ?? [],
            remain: new StockCount($model->remain),
            itemImage: $model->item_image
                ? ItemImagePath::fromRaw($model->item_image)
                : null,
        );
    }
}

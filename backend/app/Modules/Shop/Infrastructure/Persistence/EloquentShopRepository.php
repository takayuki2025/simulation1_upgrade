<?php

namespace App\Modules\Shop\Infrastructure\Persistence;

use App\Models\Shop as ShopModel;
use App\Modules\Shop\Domain\Entity\Shop;
use App\Modules\Shop\Domain\Enum\ShopStatus;
use App\Modules\Shop\Domain\Repository\ShopRepository;

final class EloquentShopRepository implements ShopRepository
{
    public function save(Shop $shop): Shop
    {
        $model = $shop->id()
            ? ShopModel::findOrFail($shop->id())
            : new ShopModel();

        $model->shop_code = $shop->shopCode();

        $model->owner_user_id = $shop->ownerUserId();
        $model->name = $shop->name();
        $model->status = $shop->status()->value;
        $model->save();


        return new Shop(
            id: $model->id,
            shopCode: $model->shop_code,
            ownerUserId: $model->owner_user_id,
            name: $model->name,
            status: ShopStatus::from($model->status),
        );
    }

    public function findByOwnerUserId(int $userId): ?Shop
    {
        $model = ShopModel::where('owner_user_id', $userId)->first();
        if (! $model) {
            return null;
        }


        return new Shop(
            id: $model->id,
            shopCode: $model->shop_code,
            ownerUserId: $model->owner_user_id,
            name: $model->name,
            status: ShopStatus::from($model->status),
        );

    }

    public function findById(int $shopId): ?Shop
    {
        $model = ShopModel::find($shopId);
        if (! $model) {
            return null;
        }


        return new Shop(
            id: $model->id,
            shopCode: $model->shop_code,
            ownerUserId: $model->owner_user_id,
            name: $model->name,
            status: ShopStatus::from($model->status),
        );

    }
}

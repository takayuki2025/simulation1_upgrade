<?php

namespace App\Modules\Item\Presentation\Http\Resources;

use App\Modules\Item\Domain\Entity\Item;

final class ItemDetailResource
{
    public static function toArray(Item $item): array
    {
        return array_merge(ItemResource::toArray($item), [
            'user_id' => $item->getUserId(),
            'shop_id' => $item->getShopId(),
        ]);
    }
}

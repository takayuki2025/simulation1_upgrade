<?php

namespace App\Modules\Item\Presentation\Http\Resources;

use App\Modules\Item\Domain\Entity\Item;
use App\Modules\Item\Domain\ValueObject\ItemImagePath;
use Illuminate\Http\Resources\Json\JsonResource;

final class ItemResource
{
    public static function fromDomain(Item $item): array
    {
        return [
            'id'         => $item->getId()->getValue(),
            'name'       => $item->getName(),
            'price'      => $item->getPrice()->getValue(),
            'brand'      => $item->getBrand(),
            'explain'    => $item->getExplain(),
            'condition'  => $item->getCondition(),
            'category'   => $item->getCategory()->toArray(),
            'remain'     => $item->getRemain()->getValue(),
            'user_id'    => $item->getUserId(),

            // ★ 正しい画像変換
            'item_image' => $item->getItemImage()
            ? $item->getItemImage()->value()
            : null,
        ];
    }
}


//     public static function toArray(Item $item): array
//     {
//         return [
//             'id'         => $item->getId()?->getValue(),
//             'name'       => $item->getName(),
//             'price'      => $item->getPrice()->getValue(),
//             'explain'    => $item->getExplain(),
//             'condition'  => $item->getCondition(),
//             'category'   => $item->getCategory()->toArray(),
//             'brand'      => $item->getBrand(),

//             /**
//              * 重要：
//              * - DB には "storage/item_images/xxx.jpg" が入っている
//              * - asset() は ASSET_URL を優先して URL を生成する
//              * - https://localhost/storage/... になる
//              */
//             'item_image' => $item->getItemImage()->toPublicPath(),

//             'remain'     => $item->getRemain()->getValue(),
//             'user_id'    => $item->getUserId(),
//             'shop_id'    => $item->getShopId(),
//         ];
//     }
// }

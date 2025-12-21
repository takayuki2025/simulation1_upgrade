<?php

namespace App\Modules\Item\Presentation\Http\Resources;

use App\Modules\Item\Domain\Entity\Item;

final class ItemDetailResource
{
    public static function toArray(Item $item): array
    {
        return array_merge(ItemResource::toArray($item), [
            'user_id' => null,
            'shop_id' => $item->getShopId(),
        ]);
    }

    /**
     * @param array $row ItemReadRepository の戻り値
     */
    public static function fromReadModel(array $row): array
    {
        return [
            'id'        => $row['id'],
            'name'      => $row['name'],
            'price'     => $row['price'],
            'explain'   => $row['explain'] ?? null,
            'remain'    => $row['remain'] ?? null,

            // ★ 正規化結果
            'brands'        => $row['brands'] ?? [],
            'brand_primary' => $row['brand_primary'] ?? null,
            'condition'     => $row['condition'] ?? null,
            'color'         => $row['color'] ?? null,

            // ★ tags（confidence 含む）
            'tags' => $row['tags'] ?? [],

            // ★ image（public URL）
            'item_image' => $row['item_image'] ?? null,
        ];
    }
}


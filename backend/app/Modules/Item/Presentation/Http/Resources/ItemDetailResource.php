<?php

namespace App\Modules\Item\Presentation\Http\Resources;

final class ItemDetailResource
{
    /**
     * @param array $row ItemReadRepository::findWithDisplayEntities の戻り値
     */
    public static function fromReadModel(array $row): array
    {
        return [
            'id'        => (int) $row['id'],
            'name'      => $row['name'],
            'price'     => (int) $row['price'],
            'explain'   => $row['explain'] ?? null,
            'remain'    => (int) ($row['remain'] ?? 0),
            'user_id'   => (int) ($row['user_id'] ?? 0),
            'shop_id'   => (int) ($row['shop_id'] ?? 0),

            // 正規化結果
            'brands'        => $row['brands'] ?? [],
            'brand_primary' => $row['brand_primary'] ?? null,
            'condition'     => $row['condition'] ?? null,
            'color'         => $row['color'] ?? null,

            // tags
            'tags' => $row['tags'] ?? [],

            // image
            'item_image' => $row['item_image'] ?? null,
        ];
    }
}

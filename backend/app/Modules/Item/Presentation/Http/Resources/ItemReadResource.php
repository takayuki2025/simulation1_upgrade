<?php

namespace App\Modules\Item\Presentation\Http\Resources;

final class ItemReadResource
{
    public static function fromRow(array $row): array
    {
        return [
            'id'         => $row['id'],
            'name'       => $row['name'],
            'price'      => $row['price'],

            // 🔥 複数ブランド → ボタン複数生成
            'brands'     => $row['brands'] ?? [],

            // 🔥 状態・カラー
            'condition'  => $row['condition'] ?? null,
            'color'      => $row['color'] ?? null,

            'explain'    => $row['explain'] ?? null,
            'category'   => $row['category'] ?? [],
            'remain'     => $row['remain'] ?? null,
            'item_image' => $row['item_image'] ?? null,
        ];
    }
}

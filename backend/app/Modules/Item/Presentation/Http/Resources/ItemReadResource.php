<?php

namespace App\Modules\Item\Presentation\Http\Resources;

final class ItemReadResource
{
    public static function fromRow(object $row): array
    {
        return [
            'id'        => $row->id,
            'name'      => $row->name,
            'price'     => $row->price,
            'brand'     => $row->display_brand, // ★ entity 優先
            'explain'   => $row->explain,
            'condition' => $row->condition,
            'category'  => $row->category,
            'remain'    => $row->remain,
            'item_image' => $row->item_image,
        ];
    }
}

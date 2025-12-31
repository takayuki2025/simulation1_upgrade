<?php

namespace App\Modules\Search\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Item as EloquentItem;

/**
 * @mixin EloquentItem
 */
final class SearchItemResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var EloquentItem $item */
        $item = $this->resource;

        return [
            'id'         => $item->id,
            'name'       => $item->name,
            'price'      => $item->price,          // ✅ 生カラム
            'remain'     => $item->remain,
            'item_image' => $item->item_image
                ? asset('storage/' . $item->item_image)
                : null,
        ];
    }
}

<?php

namespace App\Modules\Search\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Item;

/**
 * @mixin Item
 */
final class SearchItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'    => $this->id,
            'name'  => $this->name,
            'price' => $this->price,
            'remain'=> $this->remain,

            // ✅ ここで必ず「storage を除去 or 統一」
            'item_image' => ltrim(
                preg_replace('#^storage/#', '', $this->item_image),
                '/'
            ),
        ];
    }
}

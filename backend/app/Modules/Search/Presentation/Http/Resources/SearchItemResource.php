<?php

namespace App\Modules\Search\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Modules\Item\Domain\Entity\Item;

/**
 * @mixin Item
 */
final class SearchItemResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Item $item */
        $item = $this->resource;

        return [
            'id'         => $item->getId()?->getValue(),     // ✅
            'name'       => $item->getName(),
            'price'      => $item->getPrice()->getValue(),
            'remain'     => $item->getRemain()->getValue(),

            // 🔹 ValueObject は必ず getValue()
            'item_image' => $item->getItemImage()?->Value(), // ✅
        ];
    }
}
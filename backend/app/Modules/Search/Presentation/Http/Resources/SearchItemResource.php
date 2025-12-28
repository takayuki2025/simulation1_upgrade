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

        $price = $item->getPrice();
        $image = $item->getItemImage(); // ← ★これが抜けていた

        return [
            'id'   => $item->getId()?->getValue(),
            'name' => $item->getName(),
            'price'      => $item->getPrice()->amount(),
            'remain' => $item->getRemain()->getValue(),
            // Domain は path、Presentation が URL 化
            'item_image' => $image
                ? asset('storage/' . $image->value())
                : null,
        ];
    }
}

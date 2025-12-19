<?php

namespace App\Modules\Item\Presentation\Http\Resources;

use App\Modules\Item\Domain\Entity\Item;
// use App\Modules\Item\Domain\ValueObject\ItemImagePath;

final class ItemResource
{
    public static function fromDomain(Item $item): array
    {
        return [
            'id'        => $item->getId()?->getValue(),
            'name'      => $item->getName(),
            'price'     => $item->getPrice()->amount(),
            'brand'     => $item->getBrand(),
            'explain'   => $item->getExplain(),
            'condition' => $item->getCondition(),
            'category'  => $item->getCategory()->toArray(),
            'remain'    => $item->getRemain()->getValue(),
            'user_id' => null,

            // 画像
            'item_image' => $item->getItemImage()
            ? $item->getItemImage()->value()
            : null,
        ];
    }
}
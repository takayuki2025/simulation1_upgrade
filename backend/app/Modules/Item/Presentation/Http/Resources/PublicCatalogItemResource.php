<?php

namespace App\Modules\Item\Presentation\Http\Resources;

use App\Modules\Item\ReadModel\PublicCatalog\PublicCatalogItemDto;

final class PublicCatalogItemResource
{
    public static function fromDto(PublicCatalogItemDto $dto): array
    {
        return [
            'id' => $dto->id,
            'name' => $dto->name,
            'price' => $dto->price,

            // entity 優先結果
            'brand_primary' => $dto->brandPrimary,
            'condition' => $dto->conditionName,
            'color' => $dto->colorName,

            // 画像（public 前提）
            'item_image' => $dto->itemImagePath
                ? asset('storage/' . $dto->itemImagePath)
                : null,

            'published_at' => $dto->publishedAt->format('c'),
        ];
    }
}

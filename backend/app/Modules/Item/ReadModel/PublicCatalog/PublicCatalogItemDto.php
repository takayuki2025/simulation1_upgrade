<?php

namespace App\Modules\Item\ReadModel\PublicCatalog;

final class PublicCatalogItemDto
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly int $price,
        public readonly ?string $brandPrimary,
        public readonly ?string $conditionName,
        public readonly ?string $colorName,
        public readonly ?string $itemImagePath, // storage 相対 path（例: item_images/xxx.jpg）
        public readonly \DateTimeInterface $publishedAt,
    ) {
    }
}

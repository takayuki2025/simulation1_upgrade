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
        public readonly ?string $itemImagePath,
        public readonly \DateTimeInterface $publishedAt,
        public readonly ?string $displayType, // 'STAR' | 'COMET' | null
    ) {
    }
}

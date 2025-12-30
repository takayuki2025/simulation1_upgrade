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
        public readonly ?string $itemImagePath, // storage 相対 path
        public readonly \DateTimeInterface $publishedAt,

        // ★ 表示専用フラグ（自分の個人出品）
        public readonly bool $isOwnPersonalItem,
    ) {
    }
}

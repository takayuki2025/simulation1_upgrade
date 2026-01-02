<?php

namespace App\Modules\Item\Application\Assembler;

use App\Modules\Item\Application\Dto\Item\PublicItemDto;
use App\Modules\Item\Domain\Entity\Item;
use Carbon\Carbon;

final class PublicItemAssembler
{
    public static function fromItem(
        Item $item,
        ?string $displayType,
        ?int $viewerUserId,
        array $viewerShopIds,
        bool $isFavorited,
        int $favoritesCount,
    ): PublicItemDto {

        if ($displayType === 'FAVORITE') {
            $isOwner   = false;
            $canManage = false;
        } else {
            $isOwner = $viewerUserId !== null
                && $item->getCreatedByUserId() === $viewerUserId;

            $canManage = $item->getShopId() !== null
                && in_array($item->getShopId(), $viewerShopIds, true);
        }

        return new PublicItemDto(
    id: $item->getId()->getValue(),
    name: $item->getName(),
    price: $item->getPrice()->amount(),
    itemImagePath: self::resolveImagePath($item),

    // ★ Domain には存在しない → null 固定
    brandPrimary: null,
    conditionName: null,
    colorName: null,

    publishedAt: $item->getPublishedAt(),
    displayType: $displayType,
    isOwner: $isOwner,
    canManage: $canManage,
    isFavorited: $isFavorited,
    favoritesCount: $favoritesCount,
);

    }

    private static function resolveImagePath(Item $item): ?string
{
    // ★ Domain Item が持つのは item_image のみ（SoT）
    if ($item->getItemImage()) {
        return '/storage/' . ltrim($item->getItemImage()->value(), '/');
    }

    return null;
}
}
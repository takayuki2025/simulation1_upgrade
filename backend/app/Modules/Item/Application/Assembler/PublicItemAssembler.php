<?php

namespace App\Modules\Item\Application\Assembler;

use App\Models\Item as EloquentItem;
use App\Modules\Item\Application\Dto\Item\PublicItemDto;
use Carbon\Carbon;

final class PublicItemAssembler
{
    public static function fromEloquent(
        EloquentItem $model,
        ?int $viewerUserId,
        array $viewerShopIds,
        bool $isFavorited,
        int $favoritesCount,
    ): PublicItemDto {
        $isOwner = $viewerUserId !== null
            && $model->created_by_user_id === $viewerUserId;

        $canManage = $model->shop_id !== null
            && in_array($model->shop_id, $viewerShopIds, true);

        return new PublicItemDto(
            id: $model->id,
            name: $model->name,
            price: (int) $model->price,
            itemImagePath: $model->item_image
                ? '/storage/' . ltrim($model->item_image, '/')
                : null,
            brandPrimary: $model->brand ?? null,
            conditionName: $model->condition ?? null,
            colorName: null,
            publishedAt: $model->published_at
                ? Carbon::parse($model->published_at)->toISOString()
                : null,
            displayType: null,
            isOwner: $isOwner,
            canManage: $canManage,
            isFavorited: $isFavorited,
            favoritesCount: $favoritesCount,
        );
    }
}

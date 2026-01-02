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

        // =========================
        // ⭐️ / 💫 表示ルール（Amazon型）
        // =========================

        $displayType = null;

        // 💫：自分の個人出品
        if ($model->shop_id === null && $isOwner) {
            $displayType = 'MY_ITEM';
        }

        // ⭐️：自分が所属するショップの「メンバーの個人出品」
        elseif (
            $model->shop_id === null
            && !empty($viewerShopIds)
            && $model->created_by_user_id !== null
            && $model->created_by_user_id !== $viewerUserId
            && $canManage === true
        ) {
            $displayType = 'STAR';
        }

        // ❤️ FAVORITE は最優先
        if ($isFavorited) {
            $displayType = 'FAVORITE';
        }


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
            displayType: $displayType,
            isOwner: $isOwner,
            canManage: $canManage,
            isFavorited: $isFavorited,
            favoritesCount: $favoritesCount,
        );
    }
}

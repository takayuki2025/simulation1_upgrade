<?php

namespace App\Modules\Item\Application\Dto\Item;

final class PublishItemInput
{
    public function __construct(
        public readonly string $draftId,
        // public readonly string $itemOrigin, // USER_PERSONAL | SHOP_MANAGED
        // public readonly ?int $shopId,        // SHOP_MANAGED のとき必須
    ) {
    }
}

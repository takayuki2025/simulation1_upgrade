<?php

namespace App\Modules\Item\Domain\ValueObject;

enum ItemOrigin: string
{
    case USER_PERSONAL = 'USER_PERSONAL';
    case SHOP_MANAGED  = 'SHOP_MANAGED';

    public static function fromSellerId(SellerId $sellerId): self
    {
        return $sellerId->isShop()
            ? self::SHOP_MANAGED
            : self::USER_PERSONAL;
    }
}


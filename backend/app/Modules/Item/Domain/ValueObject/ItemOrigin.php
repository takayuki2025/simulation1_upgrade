<?php

namespace App\Modules\Item\Domain\ValueObject;

enum ItemOrigin: string
{
    case USER_PERSONAL = 'USER_PERSONAL';
    case SHOP_MANAGED  = 'SHOP_MANAGED';

    public function isUserPersonal(): bool
    {
        return $this === self::USER_PERSONAL;
    }

    public function isShopManaged(): bool
    {
        return $this === self::SHOP_MANAGED;
    }
}

<?php

namespace App\Modules\Shop\Domain\Policy;

use App\Models\User;
use App\Modules\Shop\Domain\Entity\Shop;

final class ShopRolePolicy
{
    public static function hasAnyRole(
        User $user,
        Shop $shop,
        array $allowedRoles
    ): bool {
        return $user->roles()
            ->whereIn('roles.slug', $allowedRoles)
            ->wherePivot('shop_id', $shop->id())
            ->exists();
    }
}

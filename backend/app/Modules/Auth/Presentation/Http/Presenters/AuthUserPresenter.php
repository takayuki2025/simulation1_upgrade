<?php

namespace App\Modules\Auth\Presentation\Http\Presenters;

use App\Models\User;

final class AuthUserPresenter
{
    public static function fromModel(User $user): array
    {
        return [
            'id'                => $user->id,
            'name'              => $user->name,
            'email'             => $user->email,
            'shop_id'           => $user->shop_id,
            'email_verified_at' => $user->email_verified_at,
            'first_login_at'    => $user->first_login_at,

            // 🔹 グローバルロール（例: developer, admin）
            'roles' => $user->roles()
                ->wherePivotNull('shop_id')
                ->pluck('slug')
                ->values(),

            // 🔹 店舗ロール（UI 判定用・超重要）
            'shop_roles' => $user->shopRoles()
                ->with(['shop', 'role'])
                ->get()
                ->map(fn ($r) => [
                    'shop_id'   => $r->shop_id,
                    'shop_code' => $r->shop->shop_code,
                    'role'      => $r->role->slug, // owner / manager / staff
                ])
                ->values(),
        ];
    }
}

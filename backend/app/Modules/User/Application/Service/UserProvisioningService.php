<?php

namespace App\Modules\User\Application\Service;

use App\Models\User;
use App\Models\Role;
use App\Modules\Auth\Domain\Port\UserProvisioningPort;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use App\Modules\Auth\Domain\Dto\ProvisionedUser;

final class UserProvisioningService implements UserProvisioningPort
{
    public function provision(AuthPrincipal $principal): ProvisionedUser
    {
        // 1) provider_uid（firebase uid）で検索 → fallback で email
        $user = User::where('firebase_uid', $principal->providerUid)->first()
            ?? ($principal->email
                ? User::where('email', $principal->email)->first()
                : null);

        $wasCreated = false;

        // 2) なければ作成
        if (! $user) {
            $user = new User([
                'email'        => $principal->email,
                'name'         => $principal->displayName,
                'firebase_uid' => $principal->providerUid,
                'password'     => bcrypt(str()->random(32)),
                'shop_id'      => null,
            ]);

            if ($principal->emailVerified) {
                $user->email_verified_at = now();
            }

            $user->save();
            $wasCreated = true;

            // 初期ロール付与
            $customerRoleId = Role::where('slug', 'customer')->value('id');
            if ($customerRoleId) {
                $user->roles()->attach($customerRoleId, ['shop_id' => null]);
            }
        }

        // 3) email_verified 同期
        if (! $user->email_verified_at && $principal->emailVerified) {
            $user->email_verified_at = now();
            $user->save();
        }

        // 4) 初回ログイン
        $isFirstLogin = is_null($user->first_login_at);
        if ($isFirstLogin) {
            $user->first_login_at = now();
            $user->save();
        }

        // 5) roles DTO 化
        $roles = collect($user->formattedRoles())
            ->pluck('slug')
            ->values()
            ->all();

        return new ProvisionedUser(
            userId: $user->id,
            email: $user->email,
            externalId: $user->firebase_uid,
            roles: $roles,
            tenantId: $user->shop_id,
            isFirstLogin: $isFirstLogin,
        );
    }
}

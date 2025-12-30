<?php

namespace App\Modules\User\Application\Service;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Modules\Auth\Domain\Port\UserProvisioningPort;
use App\Modules\Auth\Domain\Dto\ProvisionedUser;

final class UserProvisioningService implements UserProvisioningPort
{
    public function provisionFromFirebase(
        string $firebaseUid,
        ?string $email,
        bool $emailVerified,
        ?string $displayName,
    ): ProvisionedUser {

        if (! $email) {
            throw new \DomainException('Email is required for user provisioning.');
        }

        return DB::transaction(function () use (
            $email,
            $emailVerified,
            $displayName
        ) {
            /* =====================================================
             * 1. User 解決 or 作成（email が唯一のキー）
             * ===================================================== */
            $user = User::where('email', $email)->first();

            $isFirstLogin = false;

            if (! $user) {
                $user = User::create([
                    'name'              => $displayName ?? 'User',
                    'email'             => $email,
                    'email_verified_at' => $emailVerified ? now() : null,
                ]);

                $isFirstLogin = true;
            }

            /* =====================================================
             * 2. 所属ショップ解決（role_user）
             * ===================================================== */
            $shopIds = DB::table('role_user')
                ->where('user_id', $user->id)
                ->pluck('shop_id')
                ->filter()
                ->values()
                ->all();

            /* =====================================================
             * 3. tenantId（現在選択中 shop）
             * ===================================================== */
            $tenantId = $shopIds[0] ?? null;

            /* =====================================================
             * 4. roles
             * ===================================================== */
            $roles = DB::table('role_user')
                ->where('user_id', $user->id)
                ->pluck('role_id')
                ->values()
                ->all();

            /* =====================================================
             * 5. ProvisionedUser
             * ===================================================== */
            return new ProvisionedUser(
                userId: $user->id,
                email: $user->email,
                roles: $roles,
                shopIds: $shopIds,
                tenantId: $tenantId,
                isFirstLogin: $isFirstLogin,
            );
        });
    }
}

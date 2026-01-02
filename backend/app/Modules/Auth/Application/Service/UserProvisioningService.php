<?php

namespace App\Modules\User\Application\Service;

use App\Models\User;
use App\Modules\Auth\Domain\Dto\ProvisionedUser;
use App\Modules\Auth\Domain\Port\UserProvisioningPort;
use DomainException;
use Illuminate\Support\Facades\Log;

final class UserProvisioningService implements UserProvisioningPort
{
    /**
     * =====================================================
     * Firebase Login（初回作成を許可）
     * =====================================================
     */
    public function provisionFromFirebase(
        string $firebaseUid,
        ?string $email,
        bool $emailVerified,
        ?string $displayName,
    ): ProvisionedUser {
        $user = User::where('firebase_uid', $firebaseUid)->first();

        if (! $user) {
            $user = User::create([
                'firebase_uid'      => $firebaseUid,
                'email'             => $email,
                'name'              => $displayName ?? $email ?? 'Guest',
                'email_verified_at' => $emailVerified ? now() : null,
                'first_login_at'    => now(),
            ]);

            $isFirstLogin = true;

            Log::info('[Auth][Provisioning] User created from Firebase', [
                'user_id' => $user->id,
                'firebase_uid' => $firebaseUid,
            ]);
        } else {
            $isFirstLogin = false;
        }

        return new ProvisionedUser(
            userId: $user->id,
            email: $user->email,
            emailVerified: (bool) $user->email_verified_at,
            isFirstLogin: $isFirstLogin,
            shopIds: $this->resolveShopIds($user),
        );
    }

    /**
     * =====================================================
     * JWT Login（既存 User 前提 / Zero Trust）
     * =====================================================
     */
    public function provisionFromJwt(int $userId): ProvisionedUser
    {
        $user = User::find($userId);

        if (! $user) {
            Log::warning('[Auth][Provisioning] JWT user not found', [
                'user_id' => $userId,
            ]);

            // 🔐 本番では「作らない」「信用しない」
            throw new DomainException('User not found for JWT provisioning.');
        }

        return new ProvisionedUser(
            userId: $user->id,
            email: $user->email,
            emailVerified: (bool) $user->email_verified_at,
            isFirstLogin: false,
            shopIds: $this->resolveShopIds($user),
        );
    }

    /**
     * =====================================================
     * Shop 所属解決（後続拡張ポイント）
     * =====================================================
     */
    private function resolveShopIds(User $user): array
    {
        /**
         * 現時点：
         * - role_user / user_shop 等が未導入
         * - 将来ここを Repository / Policy に切り出す
         */
        return [];
    }
}

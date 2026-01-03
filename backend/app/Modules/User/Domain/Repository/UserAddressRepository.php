<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\Profile;
use App\Modules\User\Domain\Entity\UserAddress;

interface UserAddressRepository
{
    public function findPrimaryByUser(int $userId): ?UserAddress;

    /**
     * プロフィール情報から primary address を作成
     * （初回のみ想定）
     */
    public function createPrimaryFromProfile(
        int $userId,
        Profile $profile
    ): UserAddress;
}

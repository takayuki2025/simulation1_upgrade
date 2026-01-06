<?php

namespace App\Modules\User\Domain\Port;

interface ShopAddressSyncPort
{
    /**
     * User Profile 更新後に Shop 側の address 整合性を保証する
     */
    public function syncFromUserProfile(int $userId): void;
}

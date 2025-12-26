<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\UserAddress;

interface UserAddressRepository
{
    /** @return UserAddress|null */
    public function findPrimaryByUser(int $userId): ?UserAddress;
}

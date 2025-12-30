<?php

namespace App\Modules\Auth\Domain\Port;

use App\Modules\Auth\Domain\Dto\ProvisionedUser;

interface UserProvisioningPort
{
    /**
     * Firebase 認証後に User / Role / Shop を確定する
     */
    public function provisionFromFirebase(
        string $firebaseUid,
        ?string $email,
        bool $emailVerified,
        ?string $displayName,
    ): ProvisionedUser;
}

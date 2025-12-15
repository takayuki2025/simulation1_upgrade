<?php

namespace App\Modules\Auth\Domain\Port;

use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use App\Modules\Auth\Domain\Dto\ProvisionedUser;

interface UserProvisioningPort
{
    public function provision(AuthPrincipal $principal): ProvisionedUser;
}

<?php

namespace App\Modules\Auth\Application\UseCase;

use App\Modules\Auth\Application\Service\AuthContext;
use App\Modules\User\Domain\Repository\ProfileRepository;
use App\Modules\Auth\Application\Dto\AuthUserDto;
use App\Modules\Shop\Domain\Repository\ShopRoleQueryRepository;

final class GetMyProfileUseCase
{
    public function __construct(
        private AuthContext $authContext,
        private ProfileRepository $profiles,
        private ShopRoleQueryRepository $shopRoles,
    ) {
    }

    public function handle(): AuthUserDto
    {
        $principal = $this->authContext->principal();

        $profile = $this->profiles->find($principal->userId);
        if (! $profile) {
            throw new \RuntimeException('User not found');
        }

        $roles = $this->shopRoles->findByUserId($principal->userId);

        return AuthUserDto::fromProfilePrincipalAndRoles(
            profile: $profile,
            principal: $principal,
            shopRoles: $roles,
        );
    }
}

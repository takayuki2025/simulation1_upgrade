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

        // Profile は Optional
        $profile = $this->profiles->findByUserId($principal->userId);

        $roles = $this->shopRoles->findByUserId($principal->userId);

        if ($profile) {
            return AuthUserDto::fromPrincipalWithProfile(
                principal: $principal,
                profile: $profile,
                shopRoles: $roles,
            );
        }

        return AuthUserDto::fromPrincipal(
            principal: $principal,
            shopRoles: $roles,
        );
    }
}

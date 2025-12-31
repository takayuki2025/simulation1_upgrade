<?php

namespace App\Modules\Auth\Application\UseCase;

use App\Modules\Auth\Application\Service\AuthContext;
use App\Modules\User\Domain\Repository\ProfileRepository;
use App\Modules\Auth\Application\Dto\AuthUserDto;

final class GetMyProfileUseCase
{
    public function __construct(
        private AuthContext $authContext,
        private ProfileRepository $profiles,
    ) {
    }

    public function handle(): AuthUserDto
    {
        // 🔐 認証の唯一の正
        $principal = $this->authContext->principal();

        // 👤 User/Profile は「参照」
        $profile = $this->profiles->find($principal->userId);

        if (! $profile) {
            throw new \RuntimeException('User not found');
        }

        return AuthUserDto::fromProfileAndPrincipal(
            profile: $profile,
            principal: $principal,
        );
    }
}

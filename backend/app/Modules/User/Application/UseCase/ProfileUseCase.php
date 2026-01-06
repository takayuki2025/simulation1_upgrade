<?php

namespace App\Modules\User\Application\UseCase;

use App\Modules\User\Application\Dto\UpdateProfileInput;
use App\Modules\User\Domain\Entity\Profile;
use App\Modules\User\Domain\Port\ShopAddressSyncPort;
use App\Modules\User\Domain\Repository\ProfileRepository;
use App\Modules\User\Domain\Repository\UserAddressRepository;
use RuntimeException;

final class ProfileUseCase
{
    public function __construct(
        private ProfileRepository $profiles,
        private UserAddressRepository $addresses,
        private ShopAddressSyncPort $shopSync,
    ) {
    }

    public function getProfile(int $userId): Profile
    {
        $profile = $this->profiles->findByUserId($userId);

        if (! $profile) {
            throw new RuntimeException('User profile not found.');
        }

        return $profile;
    }

    public function updateProfile(int $userId, UpdateProfileInput $input): Profile
    {
        $current = $this->profiles->findByUserId($userId)
            ?? Profile::createEmpty($userId, $input->displayName);

        $next = $current->withBasic(
            displayName: $input->displayName,
            postNumber: $input->postNumber,
            address: $input->address,
            building: $input->building,
        );

        if ($current->equalsBasic($next)) {
            return $current;
        }

        $saved = $this->profiles->save($next);

        // primary address 保証
        $primary = $this->addresses->findPrimaryByUser($userId);
        if (! $primary && $saved->postNumber() && $saved->address()) {
            $this->addresses->createPrimaryFromProfile($userId, $saved);
        }

        // Shop同期
        $this->shopSync->syncFromUserProfile($userId);

        return $saved;
    }

    public function updateProfileImage(int $userId, string $path): Profile
    {
        $current = $this->profiles->findByUserId($userId);

        if (! $current) {
            throw new RuntimeException('User profile not found.');
        }

        $saved = $this->profiles->save(
            $current->withImage($path)
        );

        $this->shopSync->syncFromUserProfile($userId);

        return $saved;
    }
}
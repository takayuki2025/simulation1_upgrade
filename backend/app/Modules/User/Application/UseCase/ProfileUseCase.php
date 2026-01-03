<?php

namespace App\Modules\User\Application\UseCase;

use App\Modules\User\Application\Dto\ProfileDto;
use App\Modules\User\Domain\Repository\ProfileRepository;
use RuntimeException;

final class ProfileUseCase
{
    public function __construct(
        private ProfileRepository $profiles
    ) {
    }

    public function getProfile(int $userId): ProfileDto
    {
        $profile = $this->profiles->find($userId);

        if (! $profile) {
            throw new RuntimeException('User profile not found.');
        }

        return ProfileDto::fromEntity($profile);
    }

    // ✅ プロフィール更新（array）
    public function updateProfile(int $userId, array $data): ProfileDto
    {
        $profile = $this->profiles->update($userId, $data);
        return ProfileDto::fromEntity($profile);
    }

    // ✅ 画像更新は updateImage を呼ぶ
    public function updateProfileImage(int $userId, string $path): ProfileDto
    {
        $profile = $this->profiles->updateImage($userId, $path);
        return ProfileDto::fromEntity($profile);
    }

    public function getProfileAsArray(int $userId): array
    {
        return $this->getProfile($userId)->toArray();
    }
}

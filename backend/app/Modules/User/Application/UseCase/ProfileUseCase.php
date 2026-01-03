<?php

namespace App\Modules\User\Application\UseCase;

use App\Modules\User\Application\Dto\ProfileDto;
use App\Modules\User\Domain\Repository\ProfileRepository;
use App\Modules\User\Domain\Repository\UserAddressRepository;
use RuntimeException;

final class ProfileUseCase
{
    public function __construct(
        private ProfileRepository $profiles,
        private UserAddressRepository $addresses,
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

    /**
     * プロフィール更新
     * - users を更新
     * - primary UserAddress が無ければ作成
     * - 同一内容なら保存しない
     */
    public function updateProfile(int $userId, array $data): ProfileDto
    {
        $current = $this->profiles->find($userId);

        if (! $current) {
            throw new RuntimeException('User profile not found.');
        }

        // ✅ 差分チェック（getter 使用）
        $noChange =
            ($data['name']        ?? $current->name())        === $current->name()
         && ($data['post_number'] ?? $current->postNumber()) === $current->postNumber()
         && ($data['address']     ?? $current->address())    === $current->address()
         && ($data['building']    ?? $current->building())   === $current->building();

        if ($noChange) {
            return ProfileDto::fromEntity($current);
        }

        // 保存
        $profile = $this->profiles->update($userId, $data);

        // primary address 作成（初回のみ）
        $primary = $this->addresses->findPrimaryByUser($userId);

        if (
            ! $primary
            && $profile->postNumber()
            && $profile->address()
        ) {
            $this->addresses->createPrimaryFromProfile(
                $userId,
                $profile
            );
        }

        return ProfileDto::fromEntity($profile);
    }

    public function updateProfileImage(int $userId, string $path): ProfileDto
    {
        $profile = $this->profiles->updateImage($userId, $path);
        return ProfileDto::fromEntity($profile);
    }
}
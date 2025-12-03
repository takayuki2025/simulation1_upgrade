<?php

namespace App\Application\UseCase\Profile;

use App\Domain\Repository\ProfileRepository;

class ProfileUseCase
{
    public function __construct(
        private ProfileRepository $profiles
    ) {
    }

    /**
     * プロフィール取得
     */
    public function getProfile(int $userId)
    {
        return $this->profiles->find($userId);
    }

    /**
     * プロフィールの一般項目更新
     */
    public function updateProfile(int $userId, array $data)
    {
        return $this->profiles->update($userId, $data);
    }

    /**
     * プロフィール画像だけ更新
     */
    public function updateProfileImage(int $userId, string $path)
    {
        return $this->profiles->updateImage($userId, $path);
    }

    /**
     * 住所だけ更新（プロフィールの住所）
     */
    public function updateProfileAddress(int $userId, array $data)
    {
        return $this->profiles->updateAddress(
            userId: $userId,
            postNumber: $data['post_number'],
            address: $data['address'],
            building: $data['building'] ?? null
        );
    }
}

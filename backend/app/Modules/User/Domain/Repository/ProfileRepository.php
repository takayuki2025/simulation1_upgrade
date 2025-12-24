<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\Profile;

interface ProfileRepository
{
    /**
     * プロフィール取得
     */
    public function find(int $userId): ?Profile;

    /**
     * 基本プロフィール更新（名前など）
     */
    public function update(int $userId, array $data): Profile;

    /**
     * プロフィール画像更新
     */
    public function updateImage(int $userId, string $path): Profile;

    /**
     * プロフィール住所更新
     */
    public function updateAddress(
        int $userId,
        string $postNumber,
        string $address,
        ?string $building
    ): Profile;

    public function findByUserId(int $userId): ?Profile;
}

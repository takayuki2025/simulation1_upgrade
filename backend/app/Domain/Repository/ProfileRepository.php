<?php

namespace App\Domain\Repository;

interface ProfileRepository
{
    /**
     * プロフィール取得
     */
    public function find(int $userId): array;

    /**
     * 基本プロフィール更新（名前・メール・電話など）
     */
    public function update(int $userId, array $data): bool;

    /**
     * プロフィール画像更新
     */
    public function updateImage(int $userId, string $path): bool;

    /**
     * プロフィール住所更新
     */
    public function updateAddress(int $userId, string $postNumber, string $address, ?string $building): bool;
}

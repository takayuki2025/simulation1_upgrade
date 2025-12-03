<?php

namespace App\Domain\Repository;

interface UserRepository
{
    /**
     * フロント側に返す用（配列）
     */
    public function find(int $id): ?array;

    /**
     * Eloquent モデルが必要な場面
     */
    public function findModel(int $id): ?\App\Models\User;
}

<?php

namespace App\Domain\Repository;

use App\Models\User;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function createUser(array $data): User;
}

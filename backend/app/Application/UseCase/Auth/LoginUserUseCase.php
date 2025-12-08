<?php

namespace App\Application\UseCase\Auth;

use App\Domain\Repository\UserRepositoryInterface;

class LoginUserUseCase
{
    public function __construct(
        private UserRepositoryInterface $users
    ) {
    }

    public function __invoke(string $email, ?string $name = null)
    {
        $user = $this->users->findByEmail($email);

        if (!$user) {
            return null;
        }

        // 変更された名前があれば更新
        if ($name && $user->name !== $name) {
            $user->name = $name;
            $user->save();
        }

        return $user;
    }
}

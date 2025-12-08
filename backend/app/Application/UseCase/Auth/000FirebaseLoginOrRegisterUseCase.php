<?php

namespace App\Application\UseCase\Auth;

use Kreait\Firebase\Auth as FirebaseAuth;

use App\Domain\Auth\FirebaseAuthPort;
use App\Application\UseCase\Auth\LoginUserUseCase;
use App\Application\UseCase\Auth\RegisterUserUseCase;

class FirebaseLoginOrRegisterUseCase
{
    public function __construct(
        private FirebaseAuthPort $firebase,
        private LoginUserUseCase $loginUser,
        private RegisterUserUseCase $registerUser
    ) {
    }

    public function __invoke(string $idToken)
    {
        // Firebase Token 検証
        $verified = $this->firebase->verifyIdToken($idToken);
        $uid = $verified->claims()->get('sub');

        // Firebase ユーザー取得
        $firebaseUser = $this->firebase->getUser($uid);

        $email = $firebaseUser->email;
        $name  = $firebaseUser->displayName ?? null;

        // ① ログイン試行
        $user = ($this->loginUser)($email, $name);

        // ② なければ作成
        if (!$user) {
            $user = ($this->registerUser)($email, $name);
        }

        return $user;
    }
}

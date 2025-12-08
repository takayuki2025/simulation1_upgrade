<?php

namespace App\Application\UseCase\Auth;

use App\Domain\Repository\UserRepositoryInterface;
use App\Domain\Auth\FirebaseAuthPort;
use Illuminate\Support\Facades\Hash;

class LoginOrRegisterUseCase
{
    private UserRepositoryInterface $userRepository;
    private FirebaseAuthPort $firebaseAuth;

    public function __construct(
        UserRepositoryInterface $userRepository,
        FirebaseAuthPort $firebaseAuth
    ) {
        $this->userRepository = $userRepository;
        $this->firebaseAuth   = $firebaseAuth;
    }

    public function execute(string $firebaseIdToken): array
    {
        $verifiedToken = $this->firebaseAuth->verifyIdToken($firebaseIdToken);

        $emailRaw = $verifiedToken->claims()->get('email');
        $email = strtolower(trim($emailRaw));

        $firebaseUid = $verifiedToken->claims()->get('sub');

        $name = $verifiedToken->claims()->get('name') ?? 'No Name';
        if (!$name || trim($name) === '') {
            $name = 'No Name';
        }

        $existingUser = $this->userRepository->findByEmail($email);

        if ($existingUser) {
            return [
                'status' => 'login',
                'user'   => $existingUser,
            ];
        }

        $newUser = $this->userRepository->createUser([
            'name'         => $name,
            'email'        => $email,
            'password'     => Hash::make(uniqid()),
            'firebase_uid' => $firebaseUid,
            'shop_id'      => null,
            'role'         => 'customer',
        ]);

        return [
            'status' => 'register',
            'user'   => $newUser,
        ];
    }
}

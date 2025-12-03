<?php

namespace App\Infrastructure\Auth;

use App\Domain\Auth\FirebaseAuthPort;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Lcobucci\JWT\Token;

class FirebaseAuthAdapter implements FirebaseAuthPort
{
    public function __construct(private FirebaseAuth $auth)
    {
    }

    public function verifyIdToken(string $idToken, int $leeway = 300): Token
    {
        return $this->auth->verifyIdToken($idToken, false, $leeway);
    }

    public function markEmailVerified(string $firebaseUid): void
    {
        $this->auth->updateUser($firebaseUid, [
            'emailVerified' => true,
        ]);
    }
}

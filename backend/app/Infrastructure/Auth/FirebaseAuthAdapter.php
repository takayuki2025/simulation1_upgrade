<?php

namespace App\Infrastructure\Auth;

use App\Domain\Auth\FirebaseAuthPort;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;

class FirebaseAuthAdapter implements FirebaseAuthPort
{
    public function __construct(private FirebaseAuth $auth)
    {
    }

    public function verifyIdToken(string $idToken)
    {
        // Kreait SDK は第3引数を受け取らない
        return $this->auth->verifyIdToken($idToken);
    }

    public function getUser(string $uid)
    {
        return $this->auth->getUser($uid);
    }

    public function markEmailVerified(string $firebaseUid): void
    {
        $this->auth->updateUser($firebaseUid, [
            'emailVerified' => true,
        ]);
    }
}

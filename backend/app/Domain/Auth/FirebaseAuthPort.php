<?php

namespace App\Domain\Auth;

use Lcobucci\JWT\Token;

interface FirebaseAuthPort
{
    /** Firebase ID Token を検証する */
    public function verifyIdToken(string $idToken, int $leeway = 300): Token;

    /** Firebase の emailVerified を true に更新する */
    public function markEmailVerified(string $firebaseUid): void;
}

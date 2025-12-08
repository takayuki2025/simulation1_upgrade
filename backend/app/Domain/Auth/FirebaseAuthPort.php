<?php

namespace App\Domain\Auth;

interface FirebaseAuthPort
{
    public function verifyIdToken(string $idToken);

    public function getUser(string $uid);

    public function markEmailVerified(string $firebaseUid): void;
}

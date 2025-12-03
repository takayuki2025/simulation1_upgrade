<?php

namespace App\Domain\Service;

interface FirebaseAuthPort
{
    public function verifyIdToken(string $idToken);
    public function updateEmailVerified(string $uid): void;
}

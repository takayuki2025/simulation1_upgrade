<?php

namespace App\Modules\Auth\Infrastructure\External;

use Kreait\Firebase\Factory;
use Illuminate\Support\Facades\Log;

class FirebaseProvider
{
    private $auth;

    public function __construct()
    {
        $factory = (new Factory())
            ->withServiceAccount(config('services.firebase.credentials'))
            ->withProjectId(config('services.firebase.project_id'));

        $this->auth = $factory->createAuth();
    }

    public function verifyToken(string $idToken): array
{
    $verifiedToken = $this->auth->verifyIdToken($idToken);

    $uid = $verifiedToken->claims()->get('sub');

    // ★ ここが決定的に重要
    $userRecord = $this->auth->getUser($uid);

    return [
        'sub'            => $uid,
        'email'          => $userRecord->email,
        'name'           => $userRecord->displayName,
        'email_verified' => $userRecord->emailVerified, // ← これが真実
    ];
}

}

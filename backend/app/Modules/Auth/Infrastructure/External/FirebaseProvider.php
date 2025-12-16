<?php


namespace App\Modules\Auth\Infrastructure\External;

use Kreait\Firebase\Factory;
use Illuminate\Support\Facades\Log;

class FirebaseProvider
{
    private $auth = null;

    private function getAuth()
    {
        if ($this->auth !== null) {
            return $this->auth;
        }

        $credentials = config('services.firebase.credentials');

        if (!$credentials || !file_exists($credentials)) {
            throw new \RuntimeException(
                'Firebase service account credentials not found: ' . $credentials
            );
        }

        $factory = (new Factory())
            ->withServiceAccount($credentials)
            ->withProjectId(config('services.firebase.project_id'));

        $this->auth = $factory->createAuth();

        return $this->auth;
    }

    public function verifyToken(string $idToken): array
    {
        $auth = $this->getAuth();

        $verifiedToken = $auth->verifyIdToken($idToken);
        $uid = $verifiedToken->claims()->get('sub');
        $userRecord = $auth->getUser($uid);

        return [
            'sub'            => $uid,
            'email'          => $userRecord->email,
            'name'           => $userRecord->displayName,
            'email_verified' => $userRecord->emailVerified,
        ];
    }
}

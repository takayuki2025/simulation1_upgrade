<?php

namespace App\Modules\Auth\Infrastructure\External;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
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

        if (! $credentials || ! file_exists($credentials)) {
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

        try {
            // ★★★ ここが最重要 ★★★
            $verifiedToken = $auth->verifyIdToken(
                $idToken,
                $leewayInSeconds = 60 // ← 30〜120秒が現実解
            );
        } catch (FailedToVerifyToken $e) {
            Log::warning('[Firebase verifyToken failed]', [
                'reason' => $e->getMessage(),
            ]);
            throw $e;
        }

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

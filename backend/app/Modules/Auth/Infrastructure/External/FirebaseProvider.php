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
        $verified = $this->auth->verifyIdToken($idToken);

        return [
            'sub'            => $verified->claims()->get('sub'),
            'email'          => $verified->claims()->get('email'),
            'name'           => $verified->claims()->get('name'),
            'email_verified' => $verified->claims()->get('email_verified') ?? false,
        ];
    }
}

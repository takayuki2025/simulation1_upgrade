<?php

namespace App\Modules\Auth\Application\Dto;

class LoginOrRegisterOutput
{
    public function __construct(
        public string $token,
        public array $user,
        public string $status,
        public bool $needsEmailVerification,
        public string $refreshToken,
        public readonly bool $isFirstLogin,
    ) {
    }

    public function toArray(): array
    {
        return [
            'token'                 => $this->token,
            'refresh_token'         => $this->refreshToken,
            'user'                  => $this->user,
            'status'                => $this->status,
            'needsEmailVerification' => $this->needsEmailVerification,
            'isFirstLogin'           => $this->isFirstLogin,
        ];
    }
}

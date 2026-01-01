<?php

namespace App\Modules\Auth\Application\UseCase;

use App\Modules\Auth\Application\Dto\LoginOrRegisterInput;
use App\Modules\Auth\Application\Dto\LoginOrRegisterOutput;
use App\Modules\Auth\Domain\Port\UserProvisioningPort;
use App\Modules\Auth\Domain\Service\TokenIssuerService;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use App\Modules\Auth\Infrastructure\External\FirebaseProvider;

final class LoginOrRegisterUseCase
{
    public function __construct(
        private FirebaseProvider $firebase,
        private UserProvisioningPort $provisioning,
        private TokenIssuerService $tokenIssuer,
    ) {
    }

    public function handle(LoginOrRegisterInput $input): LoginOrRegisterOutput
    {
        /* =========================================
         * 1. Firebase ID Token 検証
         * ========================================= */
        $firebaseUser = $this->firebase->verifyToken(
            $input->firebaseIdToken
        );

        /* =========================================
         * 2. DB の事実を確定（唯一の真実）
         * ========================================= */
        $provisioned = $this->provisioning->provisionFromFirebase(
            firebaseUid: $firebaseUser['sub'],
            email: $firebaseUser['email'] ?? null,
            emailVerified: (bool) ($firebaseUser['email_verified'] ?? false),
            displayName: $input->displayName ?? $firebaseUser['name'] ?? null,
        );

        /* =========================================
         * 3. AuthPrincipal（DB → Domain）
         * ========================================= */
        $principal = AuthPrincipal::fromProvisionedUser(
            user: $provisioned,
            provider: 'firebase',
            providerUid: $firebaseUser['sub'],
            displayName: $firebaseUser['name'] ?? null,
        );

        /* =========================================
         * 4. Access Token 発行
         * ========================================= */
        $accessToken = $this->tokenIssuer->issue(
            user: $provisioned,
            principal: $principal,
        );

        /* =========================================
         * 5. Output DTO
         * ========================================= */
        return new LoginOrRegisterOutput(
            token: $accessToken,
            user: [
                'id'                => $provisioned->userId,
                'email'             => $provisioned->email,
                'email_verified_at' => $provisioned->emailVerified
                    ? now()->toISOString()
                    : null,
            ],
            status: 'ok',
            needsEmailVerification: ! $provisioned->emailVerified,
            refreshToken: '',
            isFirstLogin: $provisioned->isFirstLogin,
        );
    }
}

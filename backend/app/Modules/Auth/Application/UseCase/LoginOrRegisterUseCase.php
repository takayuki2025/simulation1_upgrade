<?php

namespace App\Modules\Auth\Application\UseCase;

use App\Models\User;
use App\Modules\Auth\Application\Dto\LoginOrRegisterInput;
use App\Modules\Auth\Application\Dto\LoginOrRegisterOutput;
use App\Modules\Auth\Infrastructure\External\FirebaseProvider;
use App\Modules\Auth\Domain\Service\TokenIssuerService;
use App\Modules\Auth\Domain\Service\RefreshTokenService;
use App\Modules\Auth\Domain\Port\UserProvisioningPort;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class LoginOrRegisterUseCase
{
    public function __construct(
        private FirebaseProvider $firebase,
        private UserProvisioningPort $userProvisioning,
        private TokenIssuerService $tokenIssuer,
        private RefreshTokenService $refreshTokens,
    ) {
    }

    public function handle(LoginOrRegisterInput $input): LoginOrRegisterOutput
    {
        /* =====================================================
         * ① Firebase 検証（SSOT）
         * ===================================================== */
        $verified = $this->firebase->verifyToken($input->firebaseIdToken);

        $firebaseUid   = (string) $verified['sub'];
        $email         = $verified['email'] ?? null;
        $emailVerified = (bool) ($verified['email_verified'] ?? false);
        $displayName   = $verified['name'] ?? null;

        /* =====================================================
         * ② User Provisioning（Firebase 専用）
         * ===================================================== */
        $provisioned = $this->userProvisioning->provisionFromFirebase(
            firebaseUid: $firebaseUid,
            email: $email,
            emailVerified: $emailVerified,
            displayName: $displayName,
        );

        /* =====================================================
         * ③ AuthPrincipal（確定版を1回だけ生成）
         * ===================================================== */
        $principal = AuthPrincipal::fromFirebase(
            firebaseUid: $firebaseUid,
            userId: $provisioned->userId,
            email: $provisioned->email,
            emailVerified: $emailVerified,
            displayName: $displayName,
            shopIds: $provisioned->shopIds ?? [],
        );

        /* =====================================================
         * ④ Access Token（✅ principal を渡す）
         * ===================================================== */
        $accessToken = $this->tokenIssuer->issue(
            user: $provisioned,
            principal: $principal,
        );

        /* =====================================================
         * ⑤ Refresh Token
         * ===================================================== */
        if ($user = User::find($provisioned->userId)) {
            $this->refreshTokens->revokeAllForUser($user);
        }

        $refresh = $this->refreshTokens->issueByUserId(
            $provisioned->userId,
            request()->ip(),
            request()->userAgent()
        );

        return new LoginOrRegisterOutput(
            token: $accessToken,
            user: [
                'id'                => $provisioned->userId,
                'name'              => $displayName,
                'email'             => $provisioned->email,
                'shop_id'           => $provisioned->tenantId,
                'email_verified_at' => $emailVerified ? now() : null,
                'first_login_at'    => $provisioned->isFirstLogin ? now() : null,
                'roles'             => $provisioned->roles,
            ],
            status: 'login_or_register',
            needsEmailVerification: ! $emailVerified,
            refreshToken: $refresh,
            isFirstLogin: $provisioned->isFirstLogin,
        );
    }
}

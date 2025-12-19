<?php

namespace App\Modules\Auth\Application\UseCase;

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
        // ① Firebase 検証（SSOT）

        $verified = $this->firebase->verifyToken($input->firebaseIdToken);


        \Log::info('[LoginOrRegister] firebase verified', [
            'keys' => array_keys($verified),
            'verified' => $verified,
        ]);



        $firebaseUid = $verified['sub'];



        \Log::info('[LoginOrRegister] firebase uid resolved', [
            'firebaseUid' => $firebaseUid,
        ]);


        $email = $verified['email'] ?? null;
        $emailVerified = (bool) ($verified['email_verified'] ?? false);
        $displayName = $verified['name'] ?? null;


        // ② AuthPrincipal（※ userId はまだ不要）
        $principal = new AuthPrincipal(
            provider: 'firebase',
            providerUid: $firebaseUid,
            userId: 0,                 // ★ 仮（次で確定）
            email: $email,
            emailVerified: $emailVerified,
            displayName: $displayName,
            shopIds: [],               // ★ 仮（次で確定）
        );

        // ③ User 側で provision（user 作成 or 取得）
        $provisioned = $this->userProvisioning->provision($principal);


        \Log::info('[LoginOrRegister] provisioned user', [
            'userId'        => $provisioned->userId,
            'email'         => $provisioned->email,
            'shopIds'       => $provisioned->shopIds ?? [],
            'isFirstLogin'  => $provisioned->isFirstLogin,
        ]);


        // ④ principal を「確定版」に更新（※ 重要）
        $principal = new AuthPrincipal(
            provider: 'firebase',
            providerUid: $firebaseUid,
            userId: $provisioned->userId,
            email: $provisioned->email,
            emailVerified: $emailVerified,
            displayName: $displayName,
            shopIds: $provisioned->shopIds ?? [],
        );

        // ⑤ Access Token 発行
        $accessToken = $this->tokenIssuer->issue($provisioned);


        \Log::info('[LoginOrRegister] issuing token with principal', [
            'userId'   => $principal->userId,
            'provider' => $principal->provider,
            'uid'      => $principal->providerUid,
            'shopIds'  => $principal->shopIds,
        ]);


        // ⑥ Refresh Token
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

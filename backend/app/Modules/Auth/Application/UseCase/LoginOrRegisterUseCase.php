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



        $principal = new AuthPrincipal(
            provider: 'firebase',
            providerUid: $verified['sub'],
            email: $verified['email'] ?? null,
            emailVerified: (bool) ($verified['email_verified'] ?? false),
            displayName: $input->displayName
                ?? ($verified['name'] ?? $verified['email'] ?? null),
        );



        // ② User側で provision（作成/初回ログイン/初期ロール/メール同期はUser責務）
        $provisioned = $this->userProvisioning->provision($principal);

        // ③ Access Token（JWT）発行（User/Eloquentに依存しない）
        $accessToken = $this->tokenIssuer->issue($provisioned);

        // ④ Refresh Token 発行（DB 永続はAuth責務でOK：ただしUserはDTOで渡すのが理想）
        //    今は既存Serviceが User(Eloquent) 前提なので、次の段階でRefreshTokenServiceもDTO対応へ寄せる。
        //    ここでは最小改修として refreshTokens->issueByUserId を追加するのがベスト。
        $refresh = $this->refreshTokens->issueByUserId(
            $provisioned->userId,
            request()->ip(),
            request()->userAgent()
        );

        return new LoginOrRegisterOutput(
            token: $accessToken,
            user: [
                'id'                => $provisioned->userId,
                'name'              => $principal->displayName,
                'email'             => $provisioned->email,
                'shop_id'           => $provisioned->tenantId,
                'email_verified_at' => $principal->emailVerified ? now() : null,
                'first_login_at'    => $provisioned->isFirstLogin ? now() : null,
                'roles'             => $provisioned->roles,
            ],
            status: 'login_or_register',
            needsEmailVerification: ! $principal->emailVerified,
            refreshToken: $refresh,
            isFirstLogin: $provisioned->isFirstLogin,
        );
    }
}

<?php

namespace App\Modules\Auth\Application\UseCase;

use App\Modules\Auth\Application\Dto\LoginOrRegisterInput;
use App\Modules\Auth\Application\Dto\LoginOrRegisterOutput;
use App\Modules\Auth\Infrastructure\External\FirebaseProvider;
use App\Modules\Auth\Domain\Repository\AuthUserRepositoryInterface;
use App\Modules\Auth\Domain\Service\TokenIssuerService;
use App\Modules\Auth\Domain\Service\RefreshTokenService;
use App\Models\User;
use App\Models\Role;

class LoginOrRegisterUseCase
{
    public function __construct(
        private FirebaseProvider $firebase,
        private AuthUserRepositoryInterface $users,
        private TokenIssuerService $tokenIssuer,
        private RefreshTokenService $refreshTokens,
    ) {
    }

    public function handle(LoginOrRegisterInput $input): LoginOrRegisterOutput
    {
        /* ============================================================
         * ① Firebase ID Token 検証（唯一の真実）
         * ============================================================ */
        $verified = $this->firebase->verifyToken($input->firebaseIdToken);

        $firebaseUid   = $verified['sub'];
        $email         = $verified['email'];
        $displayName   = $input->displayName ?? ($verified['name'] ?? $email);
        $emailVerified = (bool) ($verified['email_verified'] ?? false);

        $status     = 'login';
        $wasCreated = false;

        /* ============================================================
         * ② ユーザー検索（Firebase UID 優先）
         * ============================================================ */
        $user =
            $this->users->findByFirebaseUid($firebaseUid)
            ?? $this->users->findByEmail($email);

        /* ============================================================
         * ③ 新規登録
         * ============================================================ */
        if (! $user) {
            $user = new User([
                'email'        => $email,
                'name'         => $displayName,
                'firebase_uid' => $firebaseUid,
                'password'     => bcrypt(str()->random(32)), // Firebase 管理なのでダミー
                'shop_id'      => null, // マルチテナント初期値
            ]);

            // ★ 新規登録時点で Firebase が verified=true なら即保存
            if ($emailVerified) {
                $user->email_verified_at = now();
            }

            $user = $this->users->save($user);

            // customer ロール付与
            $customerRoleId = Role::where('slug', 'customer')->value('id');
            if ($customerRoleId) {
                $user->roles()->attach($customerRoleId, ['shop_id' => null]);
            }

            $status     = 'register';
            $wasCreated = true;
        }



        $isFirstLogin = is_null($user->first_login_at);

        // ★ 初回だけ保存
        if ($isFirstLogin) {
            $user->first_login_at = now();
            $this->users->save($user);
        }




        /* ============================================================
         * ④ メール認証同期（再ログイン / VerifyEmailPage 用）
         * ============================================================ */
        if (! $user->email_verified_at && $emailVerified) {
            $user->email_verified_at = now();
            $user = $this->users->save($user);
        }

        /* ============================================================
         * ⑤ Access Token（JWT）発行
         * ============================================================ */
        $accessToken = $this->tokenIssuer->issue($user);

        /* ============================================================
         * ⑥ Refresh Token 発行（DB 永続）
         * ============================================================ */
        $refresh = $this->refreshTokens->issue(
            $user,
            request()->ip(),
            request()->userAgent()
        );

        /* ============================================================
         * ⑦ レスポンス生成
         * ============================================================ */
        return new LoginOrRegisterOutput(
            token: $accessToken,
            user: [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'shop_id'           => $user->shop_id,
                'email_verified_at' => $user->email_verified_at,
                'first_login_at' => $user->first_login_at,
                'roles'             => $user->formattedRoles(),
            ],
            status: $status,
            needsEmailVerification: $wasCreated && ! $user->email_verified_at,
            refreshToken: $refresh,
            isFirstLogin: $isFirstLogin,
        );
    }
}

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
use Illuminate\Auth\Events\Registered;

class LoginOrRegisterUseCase
{
    private FirebaseProvider $firebase;
    private AuthUserRepositoryInterface $users;
    private TokenIssuerService $tokenIssuer;
    private RefreshTokenService $refreshTokens;

    public function __construct(
        FirebaseProvider $provider,
        AuthUserRepositoryInterface $users,
        TokenIssuerService $tokenIssuer,
        RefreshTokenService $refreshTokens,
    ) {
        $this->firebase      = $provider;
        $this->users         = $users;
        $this->tokenIssuer   = $tokenIssuer;
        $this->refreshTokens = $refreshTokens;
    }

    public function handle(LoginOrRegisterInput $input): LoginOrRegisterOutput
    {
        $verified = $this->firebase->verifyToken($input->firebaseIdToken);

        $firebaseUid   = $verified['sub'];
        $email         = $verified['email'];
        $displayName   = $input->displayName ?? $verified['name'];
        $emailVerified = $verified['email_verified'] ?? false;

        $status    = 'login';
        $wasCreated = false;

        // 既存ユーザー検索
        $user =
            $this->users->findByFirebaseUid($firebaseUid)
            ?? $this->users->findByEmail($email);

        if (! $user) {
            // 新規登録
            $user = User::create([
                'email'        => $email,
                'name'         => $displayName ?? $email,
                'firebase_uid' => $firebaseUid,
                'password'     => bcrypt(str()->random(32)),
                'shop_id'      => null, // Multi-Tenant 初期値
            ]);

            event(new Registered($user));

            $status    = 'register';
            $wasCreated = true;

            // 新規登録時の customer 権限付与
            $customerRoleId = Role::where('slug', 'customer')->value('id');
            if ($customerRoleId) {
                $user->roles()->attach($customerRoleId, ['shop_id' => null]);
            }
        }

        // メール認証同期
        if ($emailVerified && ! $user->email_verified_at) {
            $user->email_verified_at = now();
        }

        $user = $this->users->save($user);

        // ① Access Token (JWT)
        $accessToken = $this->tokenIssuer->issue($user);

        // ② Refresh Token (DB 保存)
        $refresh = $this->refreshTokens->issue(
            $user,
            request()->ip(),
            request()->userAgent()
        );

        $roles = $user->formattedRoles();

        return new LoginOrRegisterOutput(
            token: $accessToken,
            user: [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'shop_id'           => $user->shop_id,
                'email_verified_at' => $user->email_verified_at,
                'roles'             => $roles,
            ],
            status: $status,
            needsEmailVerification: $wasCreated && ! $user->email_verified_at,
            refreshToken: $refresh,

        );
    }
}

<?php

namespace App\Modules\Auth\Application\UseCase;

use App\Modules\Auth\Application\Dto\LoginOrRegisterInput;
use App\Modules\Auth\Application\Dto\LoginOrRegisterOutput;
use App\Modules\Auth\Infrastructure\External\FirebaseProvider;
use App\Modules\Auth\Domain\Repository\AuthUserRepositoryInterface;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

class LoginOrRegisterUseCase
{
    private FirebaseProvider $firebase;
    private AuthUserRepositoryInterface $users;

    public function __construct(
        FirebaseProvider $provider,
        AuthUserRepositoryInterface $users
    ) {
        $this->firebase = $provider;
        $this->users = $users;
    }

    public function handle(LoginOrRegisterInput $input): LoginOrRegisterOutput
    {
        // ★ ここが重要：Providerのメソッド verifyToken() を使う
        $verified = $this->firebase->verifyToken($input->firebaseIdToken);

        $firebaseUid   = $verified['sub'];
        $email         = $verified['email'];
        $displayName   = $input->displayName ?? $verified['name'];
        $emailVerified = $verified['email_verified'] ?? false;

        $status = 'login';
        $wasCreated = false;

        // 既存ユーザー検索
        $user =
            $this->users->findByFirebaseUid($firebaseUid)
            ?? $this->users->findByEmail($email);

        if (!$user) {
            $user = User::create([
                'email'        => $email,
                'name'         => $displayName ?? $email,
                'firebase_uid' => $firebaseUid,
                'password'     => bcrypt(str()->random(32)),
            ]);

            event(new Registered($user));
            $status = 'register';
            $wasCreated = true;
        }

        // メール認証同期
        if ($emailVerified && !$user->email_verified_at) {
            $user->email_verified_at = now();
        }

        $user = $this->users->save($user);

        // トークン発行
        $token = $user->createToken('firebase-login')->plainTextToken;

        return new LoginOrRegisterOutput(
            token: $token,
            user: [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'email_verified_at' => $user->email_verified_at,
            ],
            status: $status,
            needsEmailVerification: $wasCreated && !$user->email_verified_at
        );
    }
}

<?php

namespace App\Application\UseCase\Auth;

use App\Domain\Repository\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RegisterUserUseCase
{
    public function __construct(
        private UserRepositoryInterface $users
    ) {
    }

    public function __invoke(string $email, string $name)
    {
        return $this->users->createUser([
            'email' => $email,
            'name' => $name,
            'password' => Hash::make(Str::random(32)),
            'email_verified_at' => now(),
            'role' => 'USER',
            'shop_id' => null,   // 所属なしでスタート（後からオーナー付与）
        ]);
    }
}


    /**
     * Firebase → Laravelログイン（register + login）
     * あなたの FirebaseAuthController のロジックを 100% 移植
     */
//     public function loginOrRegister(string $idToken, ?string $name, ?string $email): array
//     {
//         Log::info("--- [UseCase] AuthUseCase loginOrRegister START ---");

//         // 1. Firebase ID Token 検証
//         $verified = $this->firebase->verifyIdToken($idToken);

//         $uid = $verified->claims()->get('sub');
//         $emailVerified = $verified->claims()->get('email_verified', false);
//         $emailFromToken = $verified->claims()->get('email');

//         $finalEmail = $emailFromToken ?? $email;
//         if (!$finalEmail) {
//             return ['error' => 'Email is required for registration or login'];
//         }

//         // 2. 名前の決定（あなたのロジックをそのまま移植）
//         $finalName = $this->decideName($name, $verified, $finalEmail, $uid);

//         // 3. ユーザー作成/更新（デッドロックリトライ対応）
//         $user = $this->resolveUserWithRetry(
//             uid: $uid,
//             email: $finalEmail,
//             name: $finalName,
//             emailVerified: $emailVerified,
//             requestNameProvided: $name !== null
//         );

//         // メール未認証フラグ
//         $needsVerification = is_null($user->email_verified_at);

//         // 4. Sanctum Token 発行
//         $user->tokens()->delete();
//         $token = $user->createToken('authToken')->plainTextToken;

//         // 5. レスポンス（あなたの形式のまま）
//         return [
//             'token' => $token,
//             'user' => $this->formatUser($user),
//             'needs_email_verification' => $needsVerification
//         ];
//     }


//     // ==========================
//     // 🔥 名前決定ロジック（移植）
//     // ==========================
//     private function decideName(?string $requestName, $verifiedToken, string $email, string $uid): string
//     {
//         if ($requestName !== null) {
//             return trim($requestName);
//         }

//         if ($verifiedToken->claims()->has('name')) {
//             $n = $verifiedToken->claims()->get('name');
//             if ($n) {
//                 return $n;
//             }
//         }

//         if (str_contains($email, '@')) {
//             $local = explode('@', $email)[0];
//             $safe = preg_replace('/[^a-zA-Z0-9_.]/', '', $local);
//             if ($safe) {
//                 return $safe;
//             }
//         }

//         return 'User-' . substr($uid, 0, 8);
//     }


//     // ==========================
//     // 🔥 Deadlock リトライ付き User 取得/作成
//     // ==========================
//     private function resolveUserWithRetry(
//         string $uid,
//         string $email,
//         string $name,
//         bool $emailVerified,
//         bool $requestNameProvided
//     ): User {
//         $max = 5;
//         $retry = 0;

//         while (true) {
//             try {
//                 return DB::transaction(function () use (
//                     $uid,
//                     $email,
//                     $name,
//                     $emailVerified,
//                     $requestNameProvided
//                 ) {
//                     // UID で検索
//                     $user = User::where('firebase_uid', $uid)
//                         ->lockForUpdate()->first();

//                     // UID がなければ email で検索
//                     if (!$user) {
//                         $user = User::where('email', $email)
//                             ->lockForUpdate()->first();
//                     }

//                     if ($user) {
//                         // 既存ユーザー更新
//                         if ($requestNameProvided) {
//                             $user->name = $name;
//                         }
//                         if ($emailVerified && !$user->email_verified_at) {
//                             $user->email_verified_at = now();
//                             event(new Verified($user));
//                         }
//                         $user->save();
//                         return $user;
//                     }

//                     // 新規作成
//                     return User::create([
//                         'name' => $name,
//                         'email' => $email,
//                         'firebase_uid' => $uid,
//                         'password' => Hash::make($uid),
//                         'email_verified_at' => $emailVerified ? now() : null,
//                     ]);
//                 });

//             } catch (\Illuminate\Database\QueryException $e) {
//                 if (
//                     ($e->getCode() === '40001') ||
//                     str_contains($e->getMessage(), 'Deadlock')
//                 ) {
//                     $retry++;
//                     if ($retry >= $max) {
//                         throw $e;
//                     }
//                     usleep(rand(100000, 500000));
//                     continue;
//                 }
//                 throw $e;
//             }
//         }
//     }


//     // ================================
//     // 🔥 User をレスポンス用に成形
//     // ================================
//     private function formatUser(User $u): array
//     {
//         return [
//             'id' => $u->id,
//             'name' => $u->name,
//             'email' => $u->email,
//             'uid' => $u->firebase_uid,
//             'email_verified_at' => $u->email_verified_at,
//             'post_number' => $u->post_number,
//             'address' => $u->address,
//             'building' => $u->building,
//             'user_image' => $u->user_image,
//         ];
//     }


//     // ================================
//     // 🔥 verifyEmail UseCase
//     // ================================
//     public function verifyEmail(int $id, string $hash, bool $validSignature)
//     {
//         $frontend = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

//         if (!$validSignature) {
//             return redirect($frontend . '/login?error=verification_failed&reason=invalid_signature');
//         }

//         $user = User::find($id);
//         if (!$user) {
//             return redirect($frontend . '/login?error=verification_failed&reason=not_found');
//         }

//         // 未認証なら認証処理
//         if (!$user->hasVerifiedEmail()) {

//             if ($user->markEmailAsVerified()) {
//                 $user->refresh();
//                 event(new Verified($user));

//                 // Sanctum 再発行
//                 $user->tokens()->delete();
//                 $token = $user->createToken('authToken')->plainTextToken;

//                 // Firebase 側も更新
//                 if ($user->firebase_uid) {
//                     $this->firebase->markEmailVerified($user->firebase_uid);
//                 }

//                 return redirect(
//                     $frontend . '/mypage/profile?verified=true&token=' . $token
//                 );
//             }

//             return redirect($frontend . '/login?error=verification_failed&reason=save_error');
//         }

//         // すでに認証済み
//         $user->tokens()->delete();
//         $token = $user->createToken('authToken')->plainTextToken;

//         return redirect(
//             $frontend . '/mypage/profile?verified=true&token=' . $token
//         );
//     }

//     public function login(string $idToken): array
//     {
//         $verified = $this->firebase->verifyIdToken($idToken);
//         $uid = $verified->claims()->get('sub');

//         $user = User::where('firebase_uid', $uid)->first();

//         if (!$user) {
//             return ['error' => 'User not found'];
//         }

//         // email_verified 更新など共通処理は loginOrRegister に統合するのもアリ

//         $user->tokens()->delete();
//         $token = $user->createToken('authToken')->plainTextToken;

//         return [
//             'user'    => $this->formatUser($user),
//             'token'   => $token,
//             'needs_email_verification' => is_null($user->email_verified_at)
//         ];
//     }


//     public function register(string $idToken, string $name, ?string $email): array
//     {
//         // loginOrRegister とほぼ同じロジック
//         return $this->loginOrRegister($idToken, $name, $email);
//     }
// }

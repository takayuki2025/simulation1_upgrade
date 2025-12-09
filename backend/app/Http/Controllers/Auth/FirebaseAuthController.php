<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Kreait\Firebase\Auth as FirebaseAuth;
use Carbon\Carbon;
use Kreait\Firebase\Factory;
use Illuminate\Auth\Events\Registered;

use Illuminate\Auth\Events\Verified;


class FirebaseAuthController extends Controller
{
    protected $auth;

    public function __construct()
    {
        $projectId = config('services.firebase.project_id');
        $credentials = config('services.firebase.credentials');

        $factory = (new Factory())
            ->withServiceAccount($credentials)
            ->withProjectId($projectId);

        $this->auth = $factory->createAuth();
    }

    /**
     * POST /api/login_or_register
     * body: { id_token: string }
     */
    public function loginOrRegister(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id_token' => ['required', 'string'],
            'name'     => ['nullable', 'string', 'max:255'], // ← ★追加：フロントからの name を受け取る
        ]);

        $customName = $data['name'] ?? null;
        $idToken = $data['id_token'];

        try {
            $verifiedIdToken = $this->auth->verifyIdToken($idToken);

            $firebaseUid   = $verifiedIdToken->claims()->get('sub');
            $email         = $verifiedIdToken->claims()->get('email');
            $emailVerified = (bool) $verifiedIdToken->claims()->get('email_verified', false);
            $displayName   = $verifiedIdToken->claims()->get('name'); // Firebase の displayName（ある場合）

            if (!$email) {
                throw ValidationException::withMessages([
                    'email' => ['Firebase トークンに email が含まれていません。'],
                ]);
            }

            Log::info('Firebase login_or_register', [
                'firebase_uid' => $firebaseUid,
                'email'        => $email,
                'display_name' => $displayName,
                'custom_name'  => $customName,
            ]);

            $status = 'login';

            $user = DB::transaction(function () use (
                $firebaseUid,
                $email,
                $emailVerified,
                $displayName,
                $customName,
                &$status
            ) {
                $user = User::where('email', $email)->first();

                if (!$user) {
                    $status = 'register';

                    $user = User::create([
                        // 優先順位：
                        // ① フロントから送られた name（input）
                        // ② Firebase の displayName
                        // ③ email
                        'name'          => $customName ?? $displayName ?? $email,
                        'email'         => $email,
                        'firebase_uid'  => $firebaseUid,
                        'role'          => 'customer',
                        'password'      => bcrypt(str()->random(32)),
                    ]);
                } else {
                    // firebase_uid が未設定なら紐付け
                    if (!$user->firebase_uid) {
                        $user->firebase_uid = $firebaseUid;
                        $user->save();
                    }

                    // 既存ユーザーでも名前を更新したい場合
                    if ($customName && $user->name !== $customName) {
                        $user->name = $customName;
                        $user->save();
                    }
                }

                if ($emailVerified && is_null($user->email_verified_at)) {
                    $user->email_verified_at = Carbon::now();
                    $user->save();
                }

                return $user;
            });


            // 💡 修正 1: status が 'register' の場合のみイベントを発火させる
            if ($status === 'register') {
                event(new Registered($user));
            }


            $token = $user->createToken('firebase-login')->plainTextToken;

            return response()->json([
                'token'  => $token,
                'user'   => [
                    'id'                => $user->id,
                    'name'              => $user->name,
                    'email'             => $user->email,
                    'role'              => $user->role,
                    'shop_id'           => $user->shop_id,
                    'user_image'        => $user->user_image,
                    'email_verified_at' => $user->email_verified_at,
                ],
                'status' => $status,
            ]);


        } catch (\Throwable $e) {
            Log::error('Firebase login_or_register error', [
                'exception' => $e,
            ]);

            return response()->json([
                'message' => 'Firebase 認証に失敗しました。',
            ], 401);
        }
    }

    /**
 * GET /api/user
 * Sanctum Token に紐づくユーザーを返す
 */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'role'              => $user->role,
                'shop_id'           => $user->shop_id,
                'user_image'        => $user->user_image,
                'email_verified_at' => $user->email_verified_at,
            ]
        ]);
    }


    public function verifyEmail(Request $request)
{
    $user = User::findOrFail($request->route('id'));

    if (! hash_equals(sha1($user->getEmailForVerification()), (string)$request->route('hash'))) {
        return redirect(config('app.frontend_url') . '/email/invalid');
    }

    if ($user->hasVerifiedEmail()) {
        return redirect(config('app.frontend_url') . '/mypage/profile?verified=true');
    }

    if ($user->markEmailAsVerified()) {
        event(new Verified($user));
    }

    // ★ Next.js 側がメール認証完了を検出するのは “verified=true” が必須
    return redirect(config('app.frontend_url') . '/mypage/profile?verified=true');
}

}

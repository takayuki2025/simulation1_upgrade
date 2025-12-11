<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Kreait\Firebase\Factory;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Database\UniqueConstraintViolationException;

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
     * Firebaseログイン・登録兼用エンドポイント
     */
    public function loginOrRegister(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id_token' => ['required', 'string'],
            'name'     => ['nullable', 'string', 'max:255'],
        ]);

        $idToken    = $data['id_token'];
        $customName = $data['name'] ?? null;

        try {
            /* ================================
                Firebase Token 検証
            ================================= */
            $verified     = $this->auth->verifyIdToken($idToken);

            $firebaseUid  = $verified->claims()->get('sub');
            $email        = $verified->claims()->get('email');
            $displayName  = $verified->claims()->get('name');
            $emailVerified = $verified->claims()->get('email_verified') ?? false;

            if (!$email) {
                throw ValidationException::withMessages([
                    'email' => ['Firebase トークンに email がありません'],
                ]);
            }

            Log::info('Firebase login_or_register start', [
                'firebase_uid'   => $firebaseUid,
                'email'          => $email,
                'display_name'   => $displayName,
                'custom_name'    => $customName,
                'emailVerified'  => $emailVerified,
            ]);

            $status         = 'login';
            $wasJustCreated = false;


            /* ================================
                ① 既存ユーザー検索
                   firebase_uid OR email
            ================================= */
            $user = User::where('firebase_uid', $firebaseUid)
                        ->orWhere('email', $email)
                        ->first();


            /* ================================
                ② 新規登録処理 (競合対策済)
            ================================= */
            if (!$user) {
                try {
                    $user = User::create([
                        'email'        => $email,
                        'name'         => $customName ?? $displayName ?? $email,
                        'firebase_uid' => $firebaseUid,
                        'password'     => bcrypt(str()->random(32)),
                    ]);

                    $status         = 'register';
                    $wasJustCreated = true;

                    // デフォルトロール付与
                    $customerRole = Role::where('slug', 'customer')->first();
                    if ($customerRole) {
                        $user->roles()->attach($customerRole->id);
                    }
                } catch (UniqueConstraintViolationException $e) {
                    Log::warning('Race detected, re-fetch existing user', [
                        'firebase_uid' => $firebaseUid,
                        'email'        => $email,
                    ]);

                    $user = User::where('firebase_uid', $firebaseUid)
                                ->orWhere('email', $email)
                                ->firstOrFail();

                    $status         = 'login';
                    $wasJustCreated = false;
                }
            }
            /* ================================
                ③ 既存ユーザー更新（同期処理）
            ================================= */ else {
                $needsUpdate = false;

                // Firebase UID を紐付け
                if (!$user->firebase_uid) {
                    $user->firebase_uid = $firebaseUid;
                    $needsUpdate = true;
                }

                // 名前同期（customName > Firebase displayName）
                $newName = $customName ?? $displayName;
                if ($newName && $newName !== $user->name) {
                    $user->name = $newName;
                    $needsUpdate = true;
                }

                // ★ Firebase EmailVerified → Laravel 自動同期
                if ($emailVerified && !$user->email_verified_at) {
                    $user->email_verified_at = now();
                    $needsUpdate = true;
                }

                if ($needsUpdate) {
                    $user->save();
                }
            }


            /* ================================
                ④ 新規登録時にメール認証イベント
            ================================= */
            if ($wasJustCreated && !$user->hasVerifiedEmail()) {
                event(new Registered($user));
            }

            // 新規作成直後でも、すでに Firebase で認証済の場合
            if ($wasJustCreated && $emailVerified) {
                $user->email_verified_at = now();
                $user->save();
            }


            /* ================================
                ⑤ Sanctum Token 発行
            ================================= */
            $token = $user->createToken('firebase-login')->plainTextToken;


            /* ================================
                ⑥ API レスポンス
            ================================= */
            return response()->json([
                'token'  => $token,
                'user'   => [
                    'id'                => $user->id,
                    'name'              => $user->name,
                    'email'             => $user->email,
                    'shop_id'           => $user->shop_id,
                    'user_image'        => $user->user_image,
                    'email_verified_at' => $user->email_verified_at,
                ],
                'status'                 => $status,
                'needsEmailVerification' => $wasJustCreated && !$user->email_verified_at,
            ]);


            Log::info('DEBUG_response', [
                'needsEmailVerification' => $wasJustCreated && !$user->email_verified_at,
                'wasJustCreated' => $wasJustCreated,
                'email_verified_at' => $user->email_verified_at,
                'firebase_email_verified' => $emailVerified,
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
     * Sanctum Token → User 情報
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'shop_id'           => $user->shop_id,
                'user_image'        => $user->user_image,
                'email_verified_at' => $user->email_verified_at,
            ]
        ]);
    }


    /**
     * GET /email/verify/{id}/{hash}
     * Laravel 経由のメール認証（Next.js 対応）
     */
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

        return redirect(config('app.frontend_url') . '/mypage/profile?verified=true');
    }
}

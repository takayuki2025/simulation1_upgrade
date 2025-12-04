<?php

namespace App\Http\Controllers\Auth;

use App\Application\UseCase\Auth\AuthUseCase;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginOrRegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Kreait\Firebase\Auth as FirebaseAuth;

use Illuminate\Support\Str;


class FirebaseAuthController extends Controller
{
    /**
     * Firebase ID Token → Laravel Token 発行（ログイン & 新規作成）
     */
    public function loginOrRegister(Request $request)
    {
        Log::info("== Firebase LoginOrRegister START ==");

        $request->validate([
            'id_token' => 'required|string',
        ]);

        try {
            /** @var \Kreait\Firebase\Auth $auth */
            $auth = app('firebase.auth');

            // Firebase Token 検証
            $verifiedToken = $auth->verifyIdToken($request->id_token);
            $uid = $verifiedToken->claims()->get('sub');

            // Firebase ユーザー取得
            $firebaseUser = $auth->getUser($uid);

            Log::info("Firebase User:", [
                'uid' => $uid,
                'email' => $firebaseUser->email,
                'name' => $firebaseUser->displayName,
            ]);

            // Laravel側のユーザー取得 or 作成

            $user = User::firstOrCreate(
                ['email' => $firebaseUser->email],
                [
                    'name' => $firebaseUser->displayName ?? 'User',
                    'email_verified_at' => $firebaseUser->emailVerified ? now() : null,
                    // Firebase Authはパスワードを持たないためランダム生成
                    'password' => Hash::make(Str::random(32)),
                ]
            );


            // Sanctum Token発行
            $token = $user->createToken('api_token')->plainTextToken;

            Log::info("Laravel User Created/Logged-in:", [
                'id' => $user->id,
                'email' => $user->email,
            ]);

            return response()->json([
                'token' => $token,
                'user'  => [
                    'id'         => $user->id,
                    'name'       => $user->name,
                    'email'      => $user->email,
                    'user_image' => $user->user_image,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error("🔥 FirebaseAuthController ERROR", [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Firebase authentication error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bearer Token でログイン中のユーザーを返す
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}

<?php

namespace App\Modules\Auth\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
// ★ 正しい DTO を use する
use App\Modules\Auth\Application\Dto\LoginOrRegisterInput;
// ★ 正しい UseCase を use する
use App\Modules\Auth\Application\UseCase\LoginOrRegisterUseCase;

class FirebaseAuthController extends Controller
{
    public function __construct(
        private LoginOrRegisterUseCase $useCase
    ) {
    }

    public function loginOrRegister(Request $request): JsonResponse
    {
        // フロントから来るキーの差異を吸収
        $rawIdToken = $request->input('id_token') ?? $request->input('firebase_token');

        if (! $rawIdToken) {
            return response()->json([
                'message' => 'id_token (or firebase_token) is required',
            ], 422);
        }

        $input = new LoginOrRegisterInput(
            firebaseIdToken: $rawIdToken,
            displayName: $request->input('name')
        );

        $output = $this->useCase->handle($input);

        return response()->json($output->toArray(), 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out',
        ], 200);
    }

    public function resend(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified.',
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification email resent.',
        ], 200);
    }
}

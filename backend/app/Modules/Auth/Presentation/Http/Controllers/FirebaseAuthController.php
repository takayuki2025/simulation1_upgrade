<?php

namespace App\Modules\Auth\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Modules\Auth\Application\Dto\LoginOrRegisterInput;
use App\Modules\Auth\Application\UseCase\LoginOrRegisterUseCase;

class FirebaseAuthController extends Controller
{
    public function __construct(
        private LoginOrRegisterUseCase $useCase
    ) {
    }

    public function loginOrRegister(Request $request): JsonResponse
    {
        $idToken = $request->input('id_token') ?? $request->input('firebase_token');

        if (! $idToken) {
            return response()->json(['message' => 'id_token required'], 422);
        }

        $input = new LoginOrRegisterInput(
            firebaseIdToken: $idToken,
            displayName: $request->input('name')
        );

        return response()->json(
            $this->useCase->handle($input)->toArray(),
            200
        );
    }

    public function logout(Request $request): JsonResponse
{
    $user = $request->user();
    if (! $user) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    // JWTはstateless。サーバ側で止める対象は RefreshToken。
    (new \App\Modules\Auth\Domain\Service\RefreshTokenService())->revokeAllForUser($user);

    return response()->json(['message' => 'Logged out']);
}
}

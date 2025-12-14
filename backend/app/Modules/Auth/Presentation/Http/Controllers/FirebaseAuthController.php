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
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out']);
    }
}

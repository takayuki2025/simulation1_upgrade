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
        // DTO を作る（ここが重要）
        $input = new LoginOrRegisterInput(
            firebaseIdToken: $request->input('id_token'),
            displayName: $request->input('name')
        );

        // UseCase 実行
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
}

<?php

namespace App\Modules\User\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Modules\User\Application\UseCase\GetProfileUseCase;
use App\Modules\User\Application\UseCase\CreateProfileUseCase;
use App\Modules\User\Application\UseCase\UpdateProfileUseCase;
use App\Modules\User\Application\UseCase\UpdateProfileImageUseCase;

use App\Modules\User\Application\Dto\CreateProfileInput;
use App\Modules\User\Application\Dto\UpdateProfileInput;

use App\Modules\User\Domain\Exception\ProfileAlreadyExistsException;
use App\Modules\User\Domain\Exception\ProfileNotFoundException;

final class MypageController extends Controller
{
    public function profile(Request $request, GetProfileUseCase $useCase)
    {
        $userId = (int) $request->user()->id;

        $profileDto = $useCase->handle($userId);

        // $hasProfile =
        //     $profileDto !== null
        //     && trim((string) ($profileDto->displayName ?? '')) !== '';

        // 🔑 暫定 Gate 条件：住所が null かどうかとりあえずアドレスで設定
            $hasProfile =
                $profileDto !== null
                && $profileDto->address !== null;

        return response()->json([
            'user' => $profileDto?->toArray(),
            'has_profile' => $hasProfile,
        ]);
    }

    /**
     * 初回作成（POST）
     */
    public function createProfile(Request $request, CreateProfileUseCase $useCase)
    {
        $userId = (int) $request->user()->id;

        $input = new CreateProfileInput(
            displayName: (string) $request->input('display_name', ''),
            postNumber: $request->input('post_number'),
            address: $request->input('address'),
            building: $request->input('building'),
        );

        try {
            $profileDto = $useCase->handle($userId, $input);

            return response()->json([
                'user' => $profileDto->toArray(),
                'has_profile' => true,
            ], 201);
        } catch (ProfileAlreadyExistsException) {
            return response()->json([
                'message' => 'Profile already exists.',
            ], 409);
        }
    }

    /**
     * 更新（PATCH）
     */
    public function updateProfile(Request $request, UpdateProfileUseCase $useCase)
    {
        $userId = (int) $request->user()->id;

        $input = new UpdateProfileInput(
            displayName: (string) $request->input('display_name', ''),
            postNumber: $request->input('post_number'),
            address: $request->input('address'),
            building: $request->input('building'),
        );

        try {
            $profileDto = $useCase->handle($userId, $input);

            return response()->json([
                'user' => $profileDto->toArray(),
                'has_profile' => true,
            ]);
        } catch (ProfileNotFoundException) {
            return response()->json([
                'message' => 'Profile not found.',
            ], 404);
        }
    }

    public function updateProfileImage(Request $request, UpdateProfileImageUseCase $useCase)
    {
        $userId = (int) $request->user()->id;

        $path = $request->file('user_image')->store('pictures_user', 'public');

        try {
            $profileDto = $useCase->handle($userId, $path);

            return response()->json([
                'user' => $profileDto->toArray(),
                'has_profile' => true,
            ]);
        } catch (ProfileNotFoundException) {
            return response()->json([
                'message' => 'Profile not found.',
            ], 404);
        }
    }

    public function sellItems(Request $request)
    {
        return response()->json([
            'items' => [],
        ]);
    }
}

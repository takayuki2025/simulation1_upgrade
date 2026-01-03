<?php

namespace App\Modules\User\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\User\Application\UseCase\MypageUseCase;
use App\Modules\User\Application\UseCase\ProfileUseCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class MypageController extends Controller
{
    public function __construct(
        private MypageUseCase $useCase
    ) {
    }

    public function profile(Request $request, ProfileUseCase $profileUseCase)
    {
        $userId = $request->user()->id;

        return response()->json([
            'user' => $profileUseCase->getProfile($userId)->toArray(),
        ]);
    }

    public function updateProfile(
        Request $request,
        ProfileUseCase $profileUseCase
    ) {
        $userId = $request->user()->id;

        // ✅ 必ず array にする
        $data = $request->only([
            'name',
            'post_number',
            'address',
            'building',
        ]);

        $profileDto = $profileUseCase->updateProfile($userId, $data);

        return response()->json([
            'user' => $profileDto->toArray(),
        ]);
    }

    public function updateProfileImage(
        Request $request,
        ProfileUseCase $profileUseCase
    ) {
        $userId = $request->user()->id;

        $path = $request->file('user_image')->store(
            'pictures_user',
            'public'
        );

        $profileDto = $profileUseCase->updateProfileImage($userId, $path);

        return response()->json([
            'user' => $profileDto->toArray(),
        ]);
    }

    public function sellItems(Request $request)
    {
        return response()->json([
            'items' => $this->useCase->listSellItems($request->user()->id),
        ]);
    }

    public function boughtItems(Request $request)
    {
        return response()->json([
            'items' => $this->useCase->listBoughtItems($request->user()->id),
        ]);
    }
}

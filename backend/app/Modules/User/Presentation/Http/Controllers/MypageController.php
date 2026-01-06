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
        private MypageUseCase $useCase,
        private ProfileUseCase $profileUseCase,
    ) {
    }

    public function profile(Request $request)
    {
        $userId = $request->user()->id;

        $profile = $this->profileUseCase->getProfile($userId);

        return response()->json([
            'user' => [
                'user_id'      => $profile->userId(),
                'display_name' => $profile->displayName(),
                'post_number'  => $profile->postNumber(),
                'address'      => $profile->address(),
                'building'     => $profile->building(),
                'user_image'   => $profile->userImage(),
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $userId = $request->user()->id;

        $data = $request->only([
            'display_name',
            'post_number',
            'address',
            'building',
        ]);

        $profile = $this->profileUseCase->updateProfile($userId, $data);

        return response()->json([
            'user' => [
                'user_id'      => $profile->userId(),
                'display_name' => $profile->displayName(),
                'post_number'  => $profile->postNumber(),
                'address'      => $profile->address(),
                'building'     => $profile->building(),
                'user_image'   => $profile->userImage(),
            ],
        ]);
    }

    public function updateProfileImage(Request $request)
    {
        $userId = $request->user()->id;

        $path = $request->file('user_image')->store(
            'pictures_user',
            'public'
        );

        $profile = $this->profileUseCase->updateProfileImage($userId, $path);

        return response()->json([
            'user' => [
                'user_id'      => $profile->userId(),
                'display_name' => $profile->displayName(),
                'post_number'  => $profile->postNumber(),
                'address'      => $profile->address(),
                'building'     => $profile->building(),
                'user_image'   => $profile->userImage(),
            ],
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
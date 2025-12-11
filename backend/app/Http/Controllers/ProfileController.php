<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\UseCase\Profile\ProfileUseCase;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    // /**
    //  * マイページ（プロフィール）取得
    //  */
    // public function show(Request $req, ProfileUseCase $useCase)
    // {
    //     return response()->json(
    //         $useCase->getProfile($req->user()->id)
    //     );
    // }

    // /**
    //  * プロフィール更新（名前・メール等）
    //  */
    // public function update(Request $req, ProfileUseCase $useCase)
    // {
    //     $req->validate([
    //         'name'  => 'nullable|string|max:255',
    //         'email' => 'nullable|email',
    //     ]);

    //     return response()->json([
    //         'success' =>
    //             $useCase->updateProfile(
    //                 $req->user()->id,
    //                 $req->only(['name', 'email'])
    //             )
    //     ]);
    // }

    // /**
    //  * プロフィール画像アップロード
    //  */
    // public function uploadImage(Request $req, ProfileUseCase $useCase)
    // {
    //     $req->validate([
    //         'user_image' => 'required|file|image|max:5120', // 5MB
    //     ]);

    //     $path = $req->file('user_image')->store('user_images', 'public');

    //     $useCase->updateImage($req->user()->id, $path);

    //     return response()->json(['path' => $path]);
    // }

    // /**
    //  * 住所更新
    //  */
    // public function updateAddress(Request $req, ProfileUseCase $useCase)
    // {
    //     $req->validate([
    //         'post_number' => 'required|string|max:20',
    //         'address'     => 'required|string|max:255',
    //         'building'    => 'nullable|string|max:255',
    //     ]);

    //     return response()->json([
    //         'success' =>
    //             $useCase->updateAddress(
    //                 $req->user()->id,
    //                 $req->input('post_number'),
    //                 $req->input('address'),
    //                 $req->input('building')
    //             )
    //     ]);
    // }
}

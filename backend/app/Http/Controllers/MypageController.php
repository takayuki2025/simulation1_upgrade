<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\UseCase\Mypage\MypageUseCase;

class MypageController extends Controller
{
    /**
     * プロフィール取得
     */
    public function profile(Request $req, MypageUseCase $useCase)
    {
        return response()->json(
            $useCase->getProfile($req->user()->id)
        );
    }

    /**
     * 出品一覧を取得
     */
    public function sellItems(Request $req, MypageUseCase $useCase)
    {
        return response()->json(
            $useCase->listSellItems($req->user()->id)
        );
    }

    /**
     * 購入済み一覧を取得
     */
    public function boughtItems(Request $req, MypageUseCase $useCase)
    {
        return response()->json(
            $useCase->listBoughtItems($req->user()->id)
        );
    }

    /**
     * 購入前の配送先入力フォーム情報を取得
     */
    public function addressForm(Request $req, MypageUseCase $useCase, int $itemId)
    {
        return response()->json(
            $useCase->getAddressForm(
                $req->user()->id,
                $itemId
            )
        );
    }

    /**
     * 購入前：住所更新（配送先）
     */
    public function updateAddress(Request $req, MypageUseCase $useCase, int $itemId)
    {
        $req->validate([
            'post_number' => 'required|string|max:20',
            'address'     => 'required|string|max:255',
            'building'    => 'nullable|string|max:255',
        ]);

        return response()->json([
            'success' =>
                $useCase->updateAddress(
                    $req->user()->id,
                    $itemId,
                    $req->input('post_number'),
                    $req->input('address'),
                    $req->input('building')
                )
        ]);
    }
}

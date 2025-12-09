<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\UseCase\Mypage\MypageUseCase;

class MypageController extends Controller
{
    private MypageUseCase $usecase;

    public function __construct(MypageUseCase $usecase)
    {
        $this->usecase = $usecase;
    }

    /**
     * プロフィール情報を返す
     */
    public function profile(Request $request)
    {
        $userId = $request->user()->id;

        $result = $this->usecase->getProfile($userId);

        return response()->json($result);
    }

    public function sellItems(Request $request)
    {
        $userId = $request->user()->id;
        return response()->json([
            'items' => $this->usecase->listSellItems($userId)
        ]);
    }

    public function boughtItems(Request $request)
    {
        $userId = $request->user()->id;
        return response()->json([
            'items' => $this->usecase->listBoughtItems($userId)
        ]);
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

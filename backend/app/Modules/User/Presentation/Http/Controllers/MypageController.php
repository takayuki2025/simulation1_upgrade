<?php

namespace App\Modules\User\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\User\Presentation\Application\UseCase\MypageUseCase;
use App\Modules\User\Presentation\Application\UseCase\ProfileUseCase;

class MypageController extends Controller
{
    private MypageUseCase $usecase;

    public function __construct(MypageUseCase $usecase)
    {
        $this->usecase = $usecase;
    }

    /**
     * プロフィール情報を返す
     * ✅ 中身は ProfileUseCase に完全委譲
     * ✅ レスポンス形式 { user: {...} } は今まで通り
     */
    public function profile(Request $request, ProfileUseCase $profileUseCase)
    {
        $userId = $request->user()->id;

        $result = $profileUseCase->getProfileAsArray($userId);

        // ★★★ 修正箇所: $result を 'user' キーでラップする ★★★
        return response()->json(['user' => $result]);
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

    // 住所フォーム & 更新はそのまま（MypageUseCase 管理）
    public function addressForm(Request $req, MypageUseCase $useCase, int $itemId)
    {
        return response()->json(
            $useCase->getAddressForm(
                $req->user()->id,
                $itemId
            )
        );
    }

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

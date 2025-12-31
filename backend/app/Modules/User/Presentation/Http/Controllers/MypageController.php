<?php

namespace App\Modules\User\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\User\Application\UseCase\MypageUseCase;
use App\Modules\User\Application\UseCase\ProfileUseCase;

final class MypageController extends Controller
{
    private MypageUseCase $useCase;

    public function __construct(MypageUseCase $useCase)
    {
        $this->useCase = $useCase;
    }

    public function profile(Request $request, ProfileUseCase $profileUseCase)
    {
        $userId = $request->user()->id;

        $result = $profileUseCase->getProfileAsArray($userId);

        return response()->json(['user' => $result]);
    }

    public function sellItems(Request $request)
    {
        $userId = $request->user()->id;

        return response()->json([
            'items' => $this->useCase->listSellItems($userId),
        ]);
    }

    public function boughtItems(Request $request)
    {
        $userId = $request->user()->id;

        return response()->json([
            'items' => $this->useCase->listBoughtItems($userId),
        ]);
    }
}

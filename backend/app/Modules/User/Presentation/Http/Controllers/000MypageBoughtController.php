<?php

namespace App\Modules\User\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\User\Application\UseCase\ListBoughtItemsUseCase;

final class MypageBoughtController extends Controller
{
    public function __invoke(
        Request $request,
        ListBoughtItemsUseCase $useCase
    ) {
        $user = $request->user();

        $items = $useCase->handle($user->id);

        return response()->json([
            'items' => $items,
        ]);
    }
}

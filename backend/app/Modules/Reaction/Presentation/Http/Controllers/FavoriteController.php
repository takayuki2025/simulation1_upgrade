<?php

namespace App\Modules\Reaction\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Reaction\Application\UseCase\Favorite\AddFavoriteUseCase;
use App\Modules\Reaction\Application\UseCase\Favorite\RemoveFavoriteUseCase;
use App\Modules\Reaction\Application\UseCase\Favorite\ListFavoriteUseCase;
use App\Modules\Reaction\Application\UseCase\Favorite\CountFavoritesUseCase;

final class FavoriteController extends Controller
{
    public function index(ListFavoriteUseCase $useCase, Request $request)
    {
        $userId = $request->user()->id;
        $favorites = $useCase->execute($userId);

        return response()->json(['favorites' => $favorites]);
    }

    public function add(AddFavoriteUseCase $add, CountFavoritesUseCase $count, Request $request, int $itemId)
    {
        $userId = $request->user()->id;

        // shop_id が必要なら request から解決（Itemから取得する場合は後で改善）
        $add->execute($userId, $itemId, $request->input('shop_id'));

        return response()->json([
            'favorited' => true,
            'message' => 'お気に入りに追加しました',
            'favorites_count' => $count->execute($itemId),
        ]);
    }

    public function remove(RemoveFavoriteUseCase $remove, CountFavoritesUseCase $count, Request $request, int $itemId)
    {
        $userId = $request->user()->id;

        $remove->execute($userId, $itemId);

        return response()->json([
            'favorited' => false,
            'message' => 'お気に入りを削除しました',
            'favorites_count' => $count->execute($itemId),
        ]);
    }
}

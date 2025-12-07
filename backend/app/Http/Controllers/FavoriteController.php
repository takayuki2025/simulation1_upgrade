<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Good;
use App\Models\Item;

class FavoriteController extends Controller
{
    /**
     * ⭐ いいね一覧（マイリスト）
     * GET /api/items/favorite
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $search = $request->query('search');

        $items = Item::query()
            ->select('items.*')
            ->join('goods', 'goods.item_id', '=', 'items.id')
            ->where('goods.user_id', $user->id)
            ->when(
                $search,
                fn ($q) =>
                $q->where('items.name', 'LIKE', "%{$search}%")
            )
            ->orderByDesc('goods.created_at')
            ->get();

        return response()->json(['items' => $items]);
    }

    /**
     * ⭐ いいね追加
     * POST /api/items/{itemId}/favorite
     */
    public function add(Request $request, $itemId)
    {
        $user = $request->user();

        Good::firstOrCreate([
            'user_id' => $user->id,
            'item_id' => $itemId,
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * ⭐ いいね削除
     * DELETE /api/items/{itemId}/favorite
     */
    public function remove(Request $request, $itemId)
    {
        $user = $request->user();

        Good::where('user_id', $user->id)
            ->where('item_id', $itemId)
            ->delete();

        return response()->json(['success' => true]);
    }
}

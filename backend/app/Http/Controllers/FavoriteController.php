<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * ⭐ お気に入り一覧を返す
     * GET /api/items/favorite
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $search = $request->query('search');

        $favorites = Item::query()
            ->select('items.*')
            ->join('favorites', 'favorites.item_id', '=', 'items.id')
            ->where('favorites.user_id', $user->id)
            ->when($search, function ($q) use ($search) {
                $q->where('items.name', 'LIKE', "%{$search}%");
            })
            ->orderBy('favorites.created_at', 'desc')
            ->get();

        return response()->json([
            'items' => $favorites
        ]);
    }

    /**
     * お気に入り追加
     */
    public function add(Request $req, $itemId)
    {
        $user = $req->user();

        Favorite::firstOrCreate([
            'user_id' => $user->id,
            'item_id' => $itemId,
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * お気に入り削除
     */
    public function remove(Request $req, $itemId)
    {
        $user = $req->user();

        Favorite::where('user_id', $user->id)
            ->where('item_id', $itemId)
            ->delete();

        return response()->json(['success' => true]);
    }

    public function list(Request $request)
    {
        $userId = $request->user()->id;

        $favorites = Favorite::where('user_id', $userId)
            ->with('item')
            ->get()
            ->pluck('item');

        return response()->json([
            'items' => $favorites
        ]);
    }
}

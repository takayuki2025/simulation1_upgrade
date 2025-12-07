<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * ⭐ 全商品一覧（認証済みなら自分の出品を除外）
     * GET /api/item
     */
    public function index(Request $request)
    {
        $query = Item::query();

        // 🔍 検索
        if ($search = $request->query('search')) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        // 🔐 認証済み → 自分の商品を除外
        if ($user = $request->user()) {
            $query->where('user_id', '!=', $user->id);
        }

        $items = $query->orderByDesc('id')->get();

        return response()->json(['items' => $items]);
    }


    /**
     * ⭐ 商品詳細
     */
    public function show($id)
    {
        $item = Item::with('user')->findOrFail($id);

        return response()->json(['item' => $item]);
    }
}

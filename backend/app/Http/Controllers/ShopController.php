<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;

class ShopController extends Controller
{
    public function show(Request $request)
    {
        $shop = app('currentShop'); // tenant ミドルウェアで設定済み

        return response()->json([
            'shop' => [
                'id' => $shop->id,
                'code' => $shop->shop_code,
                'name' => $shop->name,
                'description' => $shop->description,
                'owner_user_id' => $shop->owner_user_id,
                'status' => $shop->status,
            ]
        ]);
    }




    /**
     * POST /api/shops
     * 店舗作成（OWNER 専用）
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'shop_code' => 'required|string|unique:shops,shop_code',
            'name'      => 'required|string',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
        ]);

        $shop = Shop::create([
            'shop_code' => $validated['shop_code'],
            'name'      => $validated['name'],
            'description' => $validated['description'] ?? null,
            'logo' => $validated['logo'] ?? null,
            'owner_user_id' => $user->id,
        ]);

        return response()->json(['shop' => $shop], 201);
    }
}

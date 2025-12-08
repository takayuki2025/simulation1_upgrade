<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Http\Request;
use App\Application\UseCase\Item\ListShopItemsUseCase;

class ShopItemController extends Controller
{
    public function __construct(
        private ListShopItemsUseCase $listShopItems,
    ) {
    }

    /**
     * GET /api/shops/{shop_code}/items
     */
    public function index(Request $request, $shop_code)
    {
        try {
            \Log::info("[ShopItemController] index called", ['shop_code' => $shop_code]);

            // 店舗取得
            $shop = Shop::where('shop_code', $shop_code)->firstOrFail();

            // UseCase 呼び出し
            $items = ($this->listShopItems)($shop);

            return response()->json([
                'items' => $items,
            ]);

        } catch (\Throwable $e) {

            \Log::error("[ShopItemController ERROR]", [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'error' => 'Internal Server Error',
                'exception' => $e->getMessage()
            ], 500);
        }
    }

    // store() はまた次のステップでやる
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Shop;

class SetCurrentShop
{
    public function handle(Request $request, Closure $next)
{
    try {
        $shopCode = $request->route('shop_code');

        \Log::info("[SetCurrentShop] shop_code received", ['shop_code' => $shopCode]);

        $shop = Shop::where('shop_code', $shopCode)->first();

        if (!$shop) {
            \Log::warning("[SetCurrentShop] shop not found", ['shop_code' => $shopCode]);
            return response()->json(['error' => 'Shop not found'], 404);
        }

        app()->instance('currentShop', $shop);

        \Log::info("[SetCurrentShop] currentShop set", ['shop_id' => $shop->id]);

        return $next($request);

    } catch (\Throwable $e) {

        \Log::error("[SetCurrentShop ERROR]", [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ]);

        throw $e;
    }
}
}
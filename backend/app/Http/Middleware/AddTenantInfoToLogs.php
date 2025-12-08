<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AddTenantInfoToLogs
{
    public function handle(Request $request, Closure $next)
    {
        $shop = app()->has('currentShop') ? app('currentShop') : null;

        if ($shop) {
            Log::withContext([
                'shop_id'   => $shop->id,
                'shop_code' => $shop->shop_code,
            ]);
        }

        return $next($request);
    }
}

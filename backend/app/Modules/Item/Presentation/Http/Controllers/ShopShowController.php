<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShopShowController extends Controller
{
    public function __invoke(Request $request)
    {
        $shop = app('currentShop');

        return response()->json([
            'shop' => [
                'id'            => $shop->id,
                'shop_code'     => $shop->shop_code,
                'name'          => $shop->name,
                'description'   => $shop->description,
                'banner_url'    => $shop->banner_url,
                'owner_user_id' => $shop->owner_user_id,
            ],
        ]);
    }
}
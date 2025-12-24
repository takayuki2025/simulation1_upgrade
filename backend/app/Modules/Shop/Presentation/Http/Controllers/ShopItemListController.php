<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Shop\Domain\Entity\Shop;
use App\Modules\Item\Presentation\Http\Presenters\ItemPresenter;

final class ShopItemListController extends Controller
{
    public function __invoke(ItemRepository $items)
    {
        /** @var Shop $shop */
        $shop = app('currentShop');

        if (!$shop) {
            abort(500, 'Shop context not resolved');
        }

        $list = $items->findPublicByShopId($shop->id());

        return response()->json([
            'items' => array_map(
                fn ($item) => ItemPresenter::fromEntity($item),
                $list
            ),
        ]);
    }
}

<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Item\Application\UseCase\Item\Query\ListItemByShopUseCase;
use Illuminate\Http\Request;

class ShopItemListController extends Controller
{
    public function __construct(
        private readonly ListItemByShopUseCase $useCase
    ) {
    }

    public function __invoke(Request $request)
    {
        $shop = app('currentShop');

        $items = $this->useCase->execute($shop->id);

        $data = [];
        foreach ($items as $item) {
            $data[] = [
                'id'        => $item->getId()?->getValue(),
                'user_id' => null,
                'shop_id'   => $item->getShopId(),
                'name'      => $item->getName(),
                'price'     => $item->getPrice()->getValue(),
                'explain'   => $item->getExplain(),
                'condition' => $item->getCondition(),
                'category'  => $item->getCategory()->toArray(),
                'brand'     => $item->getBrand(),
                'item_image' => $item->getItemImage()->getPath(),
                'remain'    => $item->getRemain()->getValue(),
            ];
        }

        return response()->json(['items' => $data]);
    }
}

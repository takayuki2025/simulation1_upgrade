<?php

namespace App\application\UseCase\Item;

use App\Models\Shop;

use App\Models\Item;

use App\Domain\Repository\ItemRepositoryInterface;


class ListShopItemsUseCase
{
    public function __invoke(Shop $shop)
    {
        return Item::where('shop_id', $shop->id)
                   ->orderBy('id', 'DESC')
                   ->get();
    }
}

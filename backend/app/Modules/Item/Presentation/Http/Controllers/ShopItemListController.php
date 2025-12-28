<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Item\Application\UseCase\Item\Query\ListItemByShopUseCase;
use App\Modules\Item\Presentation\Http\Presenters\ItemPresenter;
use Illuminate\Http\Request;
use App\Modules\Shop\Domain\Entity\Shop;

final class ShopItemListController extends Controller
{
    public function __construct(
        private readonly ListItemByShopUseCase $useCase
    ) {
    }

    public function __invoke(Request $request)
    {
        /** @var Shop|null $shop */
        $shop = $request->attributes->get('currentShop');

        if (!$shop) {
            abort(500, 'ShopContext not resolved');
        }

        $items = $this->useCase->execute($shop->id());

        return response()->json([
            'shop' => [
                'id'   => $shop->id(),
                'code' => $shop->shopCode(),
                'name' => $shop->name(),
            ],
            'items' => array_map(
                static fn ($item) => ItemPresenter::fromEntity($item),
                $items
            ),
        ]);
    }
}

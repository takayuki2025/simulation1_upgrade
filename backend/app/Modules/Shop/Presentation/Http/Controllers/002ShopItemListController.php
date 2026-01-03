<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Shop\Application\Dto\ShopContext;
use App\Modules\Item\Presentation\Http\Presenters\ItemPresenter;
use Illuminate\Http\Request;

final class ShopItemListController extends Controller
{
    public function __invoke(
        Request $request,
        ItemRepository $items
    ) {
        /** @var ShopContext|null $ctx */
        $ctx = $request->attributes->get(ShopContext::class);

        if (!$ctx) {
            abort(500, 'ShopContext not resolved');
        }

        $list = $items->findPublicByShopId($ctx->shopId);

        return response()->json([
            'items' => array_map(
                static fn ($item) => ItemPresenter::fromEntity($item),
                $list
            ),
        ]);
    }
}

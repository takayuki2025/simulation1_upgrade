<?php

namespace App\Modules\Search\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Item\Application\UseCase\Item\Query\ShopSearchItemListUseCase;
use App\Modules\Item\Application\Dto\Item\ListItemsInputDto;

final class ShopItemSearchController extends Controller
{
    public function __invoke(
        Request $request,
        ShopSearchItemListUseCase $useCase
    ) {
        $shopCode = $request->query('shop_code');
        $keyword  = $request->query('keyword');

        if (!$shopCode) {
            abort(400, 'shop_code is required');
        }

        $input = new ListItemsInputDto(
            limit: 20,
            page: (int) $request->query('page', 1),
            keyword: $keyword,
            viewerUserId: null,
            viewerShopIds: [$shopCode], // ★ shopCode を唯一の真実として使う
        );

        $output = $useCase->execute($input);

        return response()->json([
            'items' => array_map(fn ($dto) => $dto->toArray(), $output->items),
            'meta' => [
                'page'    => $output->currentPage,
                'total'   => $output->total,
                'hasNext' => $output->hasNext,
            ],
        ]);
    }
}

<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Item\Application\UseCase\Catalog\Query\ListPublicCatalogItemsUseCase;

final class PublicCatalogController extends Controller
{
    public function __invoke(
        Request $request,
        ListPublicCatalogItemsUseCase $useCase
    ) {
        $collection = $useCase->execute(
            limit: 20,
            page: (int) $request->query('page', 1),
            keyword: $request->query('keyword'),
            viewerShopId: $request->user()?->shop_id
        );

        // ★ DTO はそのまま返す（Resource 不要）
        return response()->json([
            'items' => $collection->toArray(),
        ]);
    }
}

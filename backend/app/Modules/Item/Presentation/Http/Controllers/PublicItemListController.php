<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Item\Application\UseCase\Item\Query\ListPublicCatalogItemsUseCase;
use App\Modules\Item\Presentation\Http\Resources\PublicCatalogItemResource;
use App\Modules\Item\Domain\Service\ViewerShopResolver;

final class PublicItemListController extends Controller
{
    public function __invoke(
        Request $request,
        ListPublicCatalogItemsUseCase $useCase,
        ViewerShopResolver $viewerShopResolver // ★ 追加
    ) {
        $viewer = $request->user();

        $viewerShopId = $viewerShopResolver
            ->resolveForPublicCatalog($viewer);

        \Log::info('[PublicItemListController]', [
            'viewer_user_id' => $viewer?->id,
            'viewer_shop_id' => $viewerShopId,
        ]);

        $collection = $useCase->execute(
            limit: 20,
            page: (int) $request->query('page', 1),
            keyword: $request->query('keyword'),
            viewerShopId: $viewerShopId
        );

        return response()->json([
            'items' => array_map(
                fn ($dto) => PublicCatalogItemResource::fromDto($dto),
                $collection->all()
            ),
        ]);
    }
}

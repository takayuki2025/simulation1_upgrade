<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Item\Application\UseCase\Query\PublicItemListUseCase;
use App\Modules\Item\Presentation\Http\Resources\ItemResource;

/**
 * 公開用商品一覧 API
 * GET /api/items/public
 */
final class PublicItemListController extends Controller
{
    public function __invoke(
        Request $request,
        PublicItemListUseCase $useCase
    ) {
        $viewerUserId = $request->user()?->id;


        \Log::info('[PublicItemListController]', [
            'viewerUserId' => $viewerUserId,
            'keyword' => $request->query('keyword'),
            'page' => (int) $request->query('page', 1),
        ]);


        $items = $useCase->execute(
            limit: 20,
            page: (int) $request->query('page', 1),
            keyword: $request->query('keyword'),
            viewerUserId: $viewerUserId
        );


        \Log::info('[PublicItemListController] result', [
            'count' => $items->count(),
            'first' => $items->all()[0]->userId ?? null,
        ]);


        return response()->json([
            'items' => array_map(
                fn ($item) => ItemResource::fromDomain($item),
                $items->all()
            ),
        ]);
    }
}

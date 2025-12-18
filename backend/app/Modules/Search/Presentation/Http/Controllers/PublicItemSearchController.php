<?php

namespace App\Modules\Search\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Search\Application\UseCase\Query\SearchItemsUseCase;
use App\Modules\Item\Application\Dto\Item\ListItemsInputDto;
use App\Modules\Search\Presentation\Http\Resources\SearchItemResource;
use Illuminate\Support\Facades\Log;

final class PublicItemSearchController extends Controller
{
    public function __invoke(
        Request $request,
        SearchItemsUseCase $useCase
    ) {
        $keyword = $request->query('q');

        if (!$keyword) {
            return response()->json(['items' => []]);
        }

        $viewerUserId = $request->user()?->id;

        // ✅ DTO を生成
        $input = new ListItemsInputDto(
            limit: 20,
            page: (int) $request->query('page', 1),
            keyword: $keyword,
            viewerUserId: $viewerUserId,
        );

        $items = $useCase->execute($input);

        Log::info('[Search] invoked', [
            'q' => $keyword,
            'viewer' => $viewerUserId,
        ]);

        return response()->json([
            'items' => SearchItemResource::collection($items->all()),
        ]);
    }
}
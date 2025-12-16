<?php

namespace App\Modules\Search\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Search\Application\UseCase\Query\PublicItemSearchUseCase;
use App\Modules\Search\Presentation\Http\Resources\SearchItemResource;

use Illuminate\Support\Facades\Log;


final class PublicItemSearchController extends Controller
{
    public function __invoke(
        Request $request,
        PublicItemSearchUseCase $useCase
    ) {
        $keyword = $request->query('q');
        if (!$keyword) {
            return response()->json(['items' => []]);
        }

        $viewerUserId = $request->user()?->id;

        $items = $useCase->execute(
            keyword: $keyword,
            viewerUserId: $viewerUserId,
            page: (int) $request->query('page', 1)
        );


        Log::info('[Search] invoked', [
            'q' => $keyword,
            'viewer' => $viewerUserId,
        ]);


        return response()->json([
            'items' => SearchItemResource::collection($items->all())
        ]);
    }
}

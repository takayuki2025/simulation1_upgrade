<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Item\Infrastructure\Persistence\Query\ItemReadRepository;
use App\Modules\Item\Presentation\Http\Resources\ItemReadResource;
use Illuminate\Http\Request;

final class ItemReadController extends Controller
{
    public function show(
        int $itemId,
        ItemReadRepository $repository
    ) {
        $row = $repository->findWithDisplayBrand($itemId);
        abort_if(!$row, 404);

        return response()->json(
            ItemReadResource::fromRow($row)
        );
    }

    public function index(
        Request $request,
        ItemReadRepository $repository
    ) {
        $items = $repository->paginateWithDisplayBrand(
            limit: 20,
            page: (int) $request->get('page', 1)
        );

        return response()->json([
            'data' => $items->map(
                fn ($row) => ItemReadResource::fromRow($row)
            ),
        ]);
    }
}

<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Item\Application\UseCase\Item\Query\SearchItemListUseCase;
use App\Modules\Item\Application\Dto\Item\ListItemsInputDto;
use App\Modules\Item\Presentation\Http\Resources\ItemResource;

final class ItemListController extends Controller
{
    public function __invoke(
        Request $request,
        SearchItemListUseCase $useCase
    ) {

        $input = new ListItemsInputDto(
            limit: 20,
            page: (int) request()->query('page', 1),
            keyword: request()->query('keyword'),
        );


        $items = $useCase->execute($input);

        return response()->json([
            'items' => array_map(
                fn ($item) => ItemResource::fromDomain($item),
                $items->all()
            ),
        ]);
    }
}

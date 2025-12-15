<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use App\Modules\Item\Application\UseCase\Query\SearchItemsUseCase;
use App\Modules\Item\Application\Dto\SearchItemsInputDto;
use App\Modules\Item\Presentation\Http\Resources\ItemResource;

final class ItemSearchController
{
    public function __construct(
        private readonly SearchItemsUseCase $useCase
    ) {
    }

    public function __invoke(Request $request)
    {
        $result = $this->useCase->execute(
            new SearchItemsInputDto(
                keyword: $request->query('q')
            )
        );

        return response()->json([
            'data' => array_map(
                fn ($item) => ItemResource::toArray($item),
                $result
            )
        ]);
    }
}

<?php

namespace App\Modules\Search\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use App\Modules\Search\Application\UseCase\Query\SearchItemsUseCase;
use App\Modules\Item\Application\UseCase\Item\Query\SearchItemListUseCase;
use App\Modules\Item\Application\Dto\Item\ListItemsInputDto;
use App\Modules\Search\Presentation\Http\Resources\SearchItemResource;
use Illuminate\Support\Facades\Log;

final class PublicItemSearchController extends Controller
{
    public function __invoke(
        Request $request,
        SearchItemListUseCase $useCase
    ) {
        $principal = $request->attributes->get('auth_principal');

        $input = new ListItemsInputDto(
            limit: 20,
            page: (int) $request->query('page', 1),
            keyword: $request->query('keyword'),
            viewerUserId: $principal?->userId,
            viewerShopIds: $principal?->shopIds ?? [],
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

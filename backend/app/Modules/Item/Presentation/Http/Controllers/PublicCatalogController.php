<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Item\Application\UseCase\Catalog\Query\ListPublicCatalogItemsUseCase;
use App\Modules\Item\Presentation\Http\Resources\PublicCatalogItemResource;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class PublicCatalogController extends Controller
{
    public function __invoke(
        Request $request,
        ListPublicCatalogItemsUseCase $useCase
    ) {
        /** @var AuthPrincipal|null $principal */
        $principal = $request->attributes->get('auth_principal');

        $collection = $useCase->execute(
            limit: 20,
            page: (int) $request->query('page', 1),
            keyword: $request->query('keyword'),
            viewerShopIds: $principal?->shopIds ?? [],
            viewerUserId: $principal?->userId,
        );

        return response()->json([
            'items' => array_map(
                fn ($dto) => PublicCatalogItemResource::fromDto($dto),
                $collection->all()
            ),
        ]);
    }
}

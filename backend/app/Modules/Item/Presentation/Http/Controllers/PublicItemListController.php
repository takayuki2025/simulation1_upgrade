<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Item\Application\UseCase\Item\Query\ListPublicCatalogItemsUseCase;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class PublicItemListController extends Controller
{
    public function __invoke(
        Request $request,
        ListPublicCatalogItemsUseCase $useCase
    ) {
        /** @var AuthPrincipal|null $principal */
        $principal = $request->attributes->get('auth_principal');

        // ✅ 修正：単数 shopId は使わない
        $viewerShopIds = $principal?->shopIds ?? [];
        $viewerUserId  = $principal?->userId ?? null;

        $collection = $useCase->execute(
            limit: 20,
            page: (int) $request->query('page', 1),
            keyword: $request->query('keyword'),
            viewerShopIds: $viewerShopIds,
            viewerUserId: $viewerUserId,
        );

        return response()->json([
            'items' => array_map(
                fn ($dto) => [
                    'id' => $dto->id,
                    'name' => $dto->name,
                    'price' => $dto->price,
                    'brandPrimary' => $dto->brandPrimary,
                    'conditionName' => $dto->conditionName,
                    'colorName' => $dto->colorName,
                    'itemImagePath' => $dto->itemImagePath,
                    'publishedAt' => $dto->publishedAt->format(DATE_ATOM),
                    'isOwnPersonalItem' => $dto->isOwnPersonalItem,
                ],
                $collection->all()
            ),
        ]);
    }
}

<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Item\Application\UseCase\Item\Query\GetItemDetailUseCase;
use App\Modules\Item\Presentation\Http\Resources\ItemDetailResource;
use App\Modules\Item\Infrastructure\Persistence\Query\ItemReadRepository;
use App\Modules\Item\Presentation\Http\Resources\ItemReadResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ItemReadController extends Controller
{
    public function __construct(
        private ItemReadRepository $itemReadRepository,
    ) {
    }

    public function show(
        string $itemId,
        Request $request,
        GetItemDetailUseCase $useCase
    ): JsonResponse {

        /** @var AuthPrincipal|null $principal */
        $principal = $request->attributes->get('auth_principal');

        $viewerUserId = $principal?->userId;

        $result = $useCase->execute(
            itemId: (int) $itemId,
            viewerUserId: $viewerUserId
        );

        return response()->json([
            'item'            => ItemDetailResource::fromReadModel($result->item),
            'comments'        => $result->comments,
            'is_favorited'    => $result->isFavorited,
            'favorites_count' => $result->favoritesCount,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $items = $this->itemReadRepository->paginateWithDisplayBrand(
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

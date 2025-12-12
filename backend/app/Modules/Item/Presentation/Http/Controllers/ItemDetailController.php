<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Item\Presentation\Application\UseCase\Item\ItemDetailUseCase;
use Illuminate\Http\JsonResponse;

class ItemDetailController extends Controller
{
    public function __construct(
        private readonly ItemDetailUseCase $useCase
    ) {
    }

    public function __invoke(int $id): JsonResponse
    {
        $dto = $this->useCase->execute($id);

        return response()->json([
            'item' => [
                'id'        => $dto->item->getId()?->getValue(),
                'user_id'   => $dto->item->getUserId(),
                'shop_id'   => $dto->item->getShopId(),
                'name'      => $dto->item->getName(),
                'price'     => $dto->item->getPrice()->getValue(),
                'explain'   => $dto->item->getExplain(),
                'condition' => $dto->item->getCondition(),
                'category'  => $dto->item->getCategory()->toArray(),
                'brand'     => $dto->item->getBrand(),
                'item_image' => $dto->item->getItemImage()->getPath(),
                'remain'    => $dto->item->getRemain()->getValue(),
            ],
            'comments' => $dto->comments,          // Eloquent のままでもOK（user リレーション付き）
            'is_favorited' => $dto->isFavorited,
            'favorites_count' => $dto->favoritesCount,
        ]);
    }
}

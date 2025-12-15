<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Item\Application\UseCase\Query\ItemDetailUseCase;
use App\Modules\Item\Application\Dto\Item\ItemDetailOutputDto;
use App\Modules\Item\Application\Dto\Item\ItemDetailViewDto;

final class ItemDetailController extends Controller
{
    public function __invoke(
        int $id,
        Request $request,
        ItemDetailUseCase $useCase
    ) {
        $viewerUserId = $request->user()?->id;

        $output = $useCase->execute($id, $viewerUserId);

        return response()->json([
            'item' => ItemDetailViewDto::fromDomain($output->item)->toArray(),
            'comments' => $output->comments,
            'isFavorited' => $output->isFavorited,
            'favoritesCount' => $output->favoritesCount,
        ]);
    }
}




//         $dto = $this->useCase->execute($id);

//         return response()->json([
//             'item' => [
//                 'id'        => $dto->item->getId()?->getValue(),
//                 'user_id'   => $dto->item->getUserId(),
//                 'shop_id'   => $dto->item->getShopId(),
//                 'name'      => $dto->item->getName(),
//                 'price'     => $dto->item->getPrice()->getValue(),
//                 'explain'   => $dto->item->getExplain(),
//                 'condition' => $dto->item->getCondition(),
//                 'category'  => $dto->item->getCategory()->toArray(),
//                 'brand'     => $dto->item->getBrand(),
//                 'item_image' => $dto->item->getItemImage()->getPath(),
//                 'remain'    => $dto->item->getRemain()->getValue(),
//             ],
//             'comments' => $dto->comments,          // Eloquent のままでもOK（user リレーション付き）
//             'is_favorited' => $dto->isFavorited,
//             'favorites_count' => $dto->favoritesCount,
//         ]);
//     }
// }

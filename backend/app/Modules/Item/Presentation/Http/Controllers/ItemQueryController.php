<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Modules\Item\Presentation\Application\UseCase\Item\ListItemsUseCase;
use App\Modules\Item\Presentation\Application\UseCase\Item\ItemDetailUseCase;
use App\Modules\Item\Presentation\Application\Dto\Item\ListItemsInputDto;
use App\Modules\Item\Presentation\Application\UseCase\Search\CategorySearchUseCase;
use App\Modules\Item\Presentation\Application\UseCase\Search\BrandSearchUseCase;
use Illuminate\Http\Request;

class ItemQueryController
{
    public function __construct(
        private readonly ListItemsUseCase $listItemsUseCase,
        private readonly ItemDetailUseCase $itemDetailUseCase,
        // private readonly CategorySearchUseCase $categorySearchUseCase,
        // private readonly BrandSearchUseCase $brandSearchUseCase,
    ) {
    }

    public function index(Request $request)
    {
        $dto = new ListItemsInputDto(
            search: $request->query('search'),
            excludeUserId: $request->user()?->id
        );

        $result = $this->listItemsUseCase->execute($dto);

        // ======== ★ Domain Entity → 表示用配列に変換 ========
        $items = array_map(function ($item) {
            return [
                'id'         => $item->getId()?->getValue(),
                'name'       => $item->getName(),
                'price'      => $item->getPrice()->getValue(),
                'explain'    => $item->getExplain(),
                'condition'  => $item->getCondition(),
                'category'   => $item->getCategory()->toArray(),
                'brand'      => $item->getBrand(),
                'item_image' => $item->getItemImage()->getPath(),
                'remain'     => $item->getRemain()->getValue(),
            ];
        }, iterator_to_array($result->items));

        return response()->json(['items' => $items]);
    }

    public function show(int $id)
    {
        $result = $this->itemDetailUseCase->execute($id);

        $item = $result->item; // ← Domain Entity

        // ======== Domain Entity → 表示用配列へ変換 ========
        $itemData = [
            'id'         => $item->getId()?->getValue(),
            'name'       => $item->getName(),
            'price'      => $item->getPrice()->getValue(),
            'explain'    => $item->getExplain(),
            'condition'  => $item->getCondition(),
            'category'   => $item->getCategory()->getValues(),
            'brand'      => $item->getBrand(),
            'item_image' => $item->getItemImage()->getPath(),
            'remain'     => $item->getRemain()->getValue(),

            // ★ ここ重要：getUserId() / getShopId() はそのまま int として扱う
            'user_id'    => $item->getUserId(),
            'shop_id'    => $item->getShopId(),
        ];

        // ★ まずは Home と同じように「最低限の形」で返す
        //    → フロントの ItemDetailResponse の型と合わせる
        return response()->json([
            'item'            => $itemData,
            'comments'        => [],   // ひとまず空配列
            'is_favorited'    => false,
            'favorites_count' => 0,
        ]);
    }

    public function searchByCategory(Request $request)
    {
        $categories = $request->query('categories', []);
        if (is_string($categories)) {
            $categories = explode(',', $categories);
        }

        $items = $this->categorySearchUseCase->execute($categories);

        return response()->json(['items' => $items]);
    }

    public function searchByBrand(Request $request)
    {
        $brand = (string) $request->query('brand', '');

        $items = $this->brandSearchUseCase->execute($brand);

        return response()->json(['items' => $items]);
    }
}

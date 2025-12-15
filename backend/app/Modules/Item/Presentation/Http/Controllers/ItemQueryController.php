<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Modules\Item\Application\UseCase\Item\ListItemsUseCase;
use App\Modules\Item\Application\UseCase\Item\ItemDetailUseCase;
use App\Modules\Item\Application\Dto\Item\ListItemsInputDto;
use App\Modules\Item\Application\UseCase\Search\CategorySearchUseCase;
use App\Modules\Item\Application\UseCase\Search\BrandSearchUseCase;
use App\Modules\Item\Presentation\Http\Resources\ItemResource;
use App\Modules\Item\Presentation\Http\Resources\ItemDetailResource;
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

        $items = array_map(
            fn ($item) => ItemResource::toArray($item),
            iterator_to_array($result->items)
        );

        return response()->json([
            'data' => $items,
        ]);
    }

    public function show(int $id)
    {
        $result = $this->itemDetailUseCase->execute($id);
        return response()->json([
            'item' => ItemDetailResource::toArray($result->item),
            'comments' => [],
            'is_favorited' => false,
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

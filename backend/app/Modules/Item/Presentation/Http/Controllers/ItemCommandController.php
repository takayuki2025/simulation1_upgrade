<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use App\Modules\Item\Application\UseCase\Item\RegisterItemUseCase;
use App\Modules\Item\Application\UseCase\Item\UpdateItemUseCase;
use App\Modules\Item\Application\UseCase\Item\DeleteItemUseCase;
use App\Modules\Item\Application\Dto\Item\RegisterItemInputDto;
use App\Modules\Item\Application\Dto\Item\UpdateItemInputDto;
use App\Modules\Item\Presentation\Http\Requests\RegisterItemRequest;
use App\Modules\Item\Presentation\Http\Requests\UpdateItemRequest;

class ItemCommandController
{
    public function __construct(
        private readonly RegisterItemUseCase $registerItemUseCase,
        private readonly UpdateItemUseCase $updateItemUseCase,
        private readonly DeleteItemUseCase $deleteItemUseCase,
    ) {
    }

    public function store(RegisterItemRequest $request)
    {
        $userId = $request->user()->id;

        $dto = new RegisterItemInputDto(
            userId: $userId,
            shopId: $request->input('shop_id'),
            name: $request->input('name'),
            price: (int) $request->input('price'),
            explain: $request->input('explain'),
            condition: $request->input('condition'),
            category: $request->input('category', []),
            brand: $request->input('brand'),
            itemImagePath: $request->input('item_image'),
            remain: (int) $request->input('remain'),
        );

        $id = $this->registerItemUseCase->execute($dto);

        return response()->json([
            'id' => $id,
            'message' => 'Item created',
        ], 201);
    }

    public function update(UpdateItemRequest $request, int $id)
    {
        $userId = $request->user()->id;

        $dto = new UpdateItemInputDto(
            itemId: $id,
            userId: $userId,
            shopId: $request->input('shop_id'),
            name: $request->input('name'),
            price: (int) $request->input('price'),
            explain: $request->input('explain'),
            condition: $request->input('condition'),
            category: $request->input('category', []),
            brand: $request->input('brand'),
            itemImagePath: $request->input('item_image'),
            remain: (int) $request->input('remain'),
        );

        $this->updateItemUseCase->execute($dto);

        return response()->json(['message' => 'Item updated']);
    }

    public function destroy(int $id)
    {
        $this->deleteItemUseCase->execute($id);

        return response()->json([], 204);
    }
}

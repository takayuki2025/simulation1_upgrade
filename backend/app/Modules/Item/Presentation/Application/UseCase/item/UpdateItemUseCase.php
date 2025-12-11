<?php

namespace App\Modules\Item\Presentation\Application\UseCase\Item;

use App\Modules\Item\Presentation\Application\Dto\Item\UpdateItemInputDto;
use App\Modules\Item\Presentation\Domain\Repository\ItemRepository;
use App\Modules\Item\Presentation\Domain\ValueObject\CategoryList;
use App\Modules\Item\Presentation\Domain\ValueObject\ItemImagePath;
use App\Modules\Item\Presentation\Domain\ValueObject\Price;
use App\Modules\Item\Presentation\Domain\ValueObject\StockCount;
use RuntimeException;

class UpdateItemUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
    ) {
    }

    public function execute(UpdateItemInputDto $input): void
    {
        $item = $this->itemRepository->findById($input->itemId);
        if (!$item) {
            throw new RuntimeException('Item not found');
        }

        // Domain Entity を新しく再構築してもよいが、
        // 今回は既存 Entity を再利用するパターンでも OK
        $updated = new \App\Modules\Item\Domain\Entity\Item(
            id: $item->getId(),
            userId: $input->userId,
            shopId: $input->shopId,
            name: $input->name,
            price: new Price($input->price),
            explain: $input->explain,
            condition: $input->condition,
            category: new CategoryList($input->category),
            brand: $input->brand,
            itemImage: new ItemImagePath($input->itemImagePath ?? $item->getItemImage()->getPath()),
            remain: new StockCount($input->remain),
        );

        $this->itemRepository->save($updated);
    }
}

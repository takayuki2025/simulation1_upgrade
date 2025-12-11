<?php

namespace App\Modules\Item\Presentation\Application\UseCase\Item;

use App\Modules\Item\Presentation\Application\Dto\Item\RegisterItemInputDto;
use App\Modules\Item\Presentation\Domain\Entity\Item;
use App\Modules\Item\Presentation\Domain\Repository\ItemRepository;
use App\Modules\Item\Presentation\Domain\ValueObject\CategoryList;
use App\Modules\Item\Presentation\Domain\ValueObject\ItemId;
use App\Modules\Item\Presentation\Domain\ValueObject\ItemImagePath;
use App\Modules\Item\Presentation\Domain\ValueObject\Price;
use App\Modules\Item\Presentation\Domain\ValueObject\StockCount;

class RegisterItemUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
    ) {
    }

    public function execute(RegisterItemInputDto $input): int
    {
        $item = new Item(
            id: null,
            userId: $input->userId,
            shopId: $input->shopId,
            name: $input->name,
            price: new Price($input->price),
            explain: $input->explain,
            condition: $input->condition,
            category: new CategoryList($input->category),
            brand: $input->brand,
            itemImage: new ItemImagePath($input->itemImagePath),
            remain: new StockCount($input->remain),
        );

        $saved = $this->itemRepository->save($item);

        return $saved->getId()?->getValue() ?? 0;
    }
}

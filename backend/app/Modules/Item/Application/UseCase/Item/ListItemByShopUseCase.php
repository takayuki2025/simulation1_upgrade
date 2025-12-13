<?php

namespace App\Modules\Item\Application\UseCase\Item;

use App\Modules\Item\Domain\Repository\ItemRepository;

class ListItemByShopUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository
    ) {
    }

    public function execute(int $shopId): iterable
    {
        return $this->itemRepository->listByShop($shopId);
    }
}

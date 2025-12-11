<?php


namespace App\Modules\Item\Presentation\Application\UseCase\Cart;

use App\Modules\Item\Presentation\Domain\Repository\ItemRepository;

class CartItemListUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
    ) {
    }

    public function execute(int $userId): iterable
    {
        return $this->itemRepository->listByCartUser($userId);
    }
}

<?php


namespace App\Modules\Item\Presentation\Application\UseCase\Stock;

use App\Modules\Item\Presentation\Domain\Repository\ItemRepository;

class StockUpdateUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
    ) {
    }

    public function execute(int $itemId, int $newRemain): void
    {
        $this->itemRepository->updateStock($itemId, $newRemain);
    }
}

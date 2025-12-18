<?php

namespace App\Modules\Item\Application\UseCase\Item\Command;

use App\Modules\Item\Domain\Repository\ItemRepository;

class DeleteItemUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
    ) {
    }

    public function execute(int $id): void
    {
        $this->itemRepository->delete($id);
    }
}

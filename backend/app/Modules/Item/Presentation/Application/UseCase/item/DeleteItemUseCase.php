<?php

namespace App\Modules\Item\Presentation\Application\UseCase\Item;

use App\Modules\Item\Presentation\Domain\Repository\ItemRepository;

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

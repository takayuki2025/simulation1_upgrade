<?php

namespace App\Modules\Item\Application\UseCase\Item;

use App\Modules\Item\Application\Dto\Item\ListItemsInputDto;
use App\Modules\Item\Application\Dto\Item\ListItemsOutputDto;
use App\Modules\Item\Domain\Repository\ItemRepository;

class ListItemsUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
    ) {
    }

    public function execute(ListItemsInputDto $input): ListItemsOutputDto
    {
        $items = $itemRepositoryItems = $this->itemRepository->listAll(
            $input->search,
            $input->excludeUserId
        );

        return new ListItemsOutputDto($items);
    }
}

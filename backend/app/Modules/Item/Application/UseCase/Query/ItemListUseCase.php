<?php

namespace App\Modules\Item\Application\UseCase\Query;

use App\Modules\Item\Domain\Repository\ItemRepository;

use App\Modules\Item\Domain\Collection\Items;

use App\Modules\Item\Application\Dto\Item\{
    ListItemsInputDto,
    ListItemsOutputDto
};



final class ItemListUseCase
{
    public function __construct(
        private ItemRepository $itemRepository,
    ) {
    }

    public function execute(ListItemsInputDto $input): Items
    {
        // ❗ named parameter を使わない
        return $this->itemRepository->findAll(
            $input->limit,
            $input->page,
            $input->keyword,
        );
    }
}


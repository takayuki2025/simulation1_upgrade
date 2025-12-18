<?php

namespace App\Modules\Item\Application\UseCase\Item\Query;

use App\Modules\Item\Domain\Repository\ItemRepository;

use App\Modules\Item\Domain\Collection\Items;

use App\Modules\Item\Application\Dto\Item\{
    ListItemsInputDto,
    ListItemsOutputDto
};



final class SearchItemListUseCase
{
    public function __construct(
        private ItemRepository $itemRepository,
    ) {
    }

    public function execute(ListItemsInputDto $input): Items
{
    return $this->itemRepository->searchPublic(
        limit: $input->limit,
        page: $input->page,
        keyword: $input->keyword,
        viewerUserId: $input->viewerUserId,
    );
}
}


<?php

namespace App\Modules\Search\Application\UseCase\Query;

use App\Modules\Item\Application\UseCase\Item\Query\SearchItemListUseCase;
use App\Modules\Item\Application\Dto\Item\ListItemsInputDto;
use App\Modules\Item\Domain\Collection\Items;

final class SearchItemsUseCase
{
    public function __construct(
        private SearchItemListUseCase $itemSearchUseCase
    ) {
    }

    public function execute(ListItemsInputDto $input): Items
    {
        return $this->itemSearchUseCase->execute($input);
    }
}

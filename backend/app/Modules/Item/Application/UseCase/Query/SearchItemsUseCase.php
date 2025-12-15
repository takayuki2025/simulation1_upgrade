<?php

namespace App\Modules\Item\Application\UseCase\Query;

use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Application\Dto\Item\SearchItemsInput;

final class SearchItemsUseCase
{
    public function __construct(
        private readonly ItemRepository $repository
    ) {
    }

    public function execute(SearchItemsInputDto $input): iterable
    {
        return $this->repository->searchByKeyword(
            $input->keyword
        );
    }
}

<?php

namespace App\Modules\Item\Application\UseCase\Item;


use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Domain\Collection\Items;

final class GetItemListUseCase
{
    public function __construct(
        private ItemRepository $repository
    ) {
    }

    public function execute(): Items
    {
        return $this->repository->findAll();
    }
}

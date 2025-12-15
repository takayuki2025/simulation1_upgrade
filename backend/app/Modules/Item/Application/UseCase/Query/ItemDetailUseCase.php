<?php

namespace App\Modules\Item\Application\UseCase\Query;

use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Application\Dto\Item\ItemDetailOutputDto;
use RuntimeException;
use App\Modules\Item\Application\Dto\Item\ItemDetailViewDto;

final class ItemDetailUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
    ) {
    }

    public function execute(int $id, ?int $userId): ItemDetailOutputDto
    {
        $item = $this->itemRepository->findById($id);

        if (! $item) {
            throw new RuntimeException('Item not found');
        }


        $comments = [];
        $isFavorited = [];
        $favoritesCount = [];

        return new ItemDetailOutputDto(
            item: new ItemDetailViewDto(
                id: $item->getId()->getValue(),
                name: $item->getName(),
                price: $item->getPrice()->getValue(),
                brand: $item->getBrand(),
                explain: $item->getExplain(),
                condition: $item->getCondition(),
                category: $item->getCategory()->toArray(),
                item_image: $item->getItemImage()?->getValue(),
                remain: $item->getRemain()->getValue(),
                user_id: $item->getUserId(),
            ),
            comments: $comments,
            isFavorited: $isFavorited,
            favoritesCount: $favoritesCount,
        );
    }
}

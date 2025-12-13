<?php

namespace App\Modules\Item\Application\UseCase\Item;

use App\Modules\Item\Application\Dto\Item\ItemDetailOutputDto;
use App\Modules\Item\Domain\Repository\ItemRepository;
use Illuminate\Support\Facades\Auth;
use RuntimeException;

class ItemDetailUseCase
{
    public function __construct(
        private readonly ItemRepository $itemRepository,
    ) {
    }

    public function execute(int $id): ItemDetailOutputDto
    {
        $item = $this->itemRepository->findById($id);

        if (!$item) {
            throw new RuntimeException('Item not found');
        }

        $userId = Auth::id();

        // ★ コメント一覧
        $comments = $this->itemRepository->listComments($id);

        // ★ お気に入り判定
        $isFavorited = $userId
            ? $this->itemRepository->isFavorited($id, $userId)
            : false;

        // ★ お気に入り数
        $favoritesCount = $this->itemRepository->favoritesCount($id);

        return new ItemDetailOutputDto(
            item: $item,
            comments: $comments,
            isFavorited: $isFavorited,
            favoritesCount: $favoritesCount,
        );
    }
}

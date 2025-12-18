<?php

namespace App\Modules\Item\Domain\Repository;

use App\Modules\Item\Domain\Collection\Items;
use App\Modules\Item\Domain\Entity\Item;

use App\Modules\Item\Domain\ValueObject\ItemId;


interface ItemRepository
{
    public function findAll(
        int $limit,
        int $page,
        ?string $keyword
    ): Items;

    public function searchByKeyword(string $keyword): Items;

    public function findById(int $id): ?Item;

    /** お気に入り数 */
    public function favoritesCount(int $itemId): int;

    /** ユーザーがお気に入り済みか */
    public function isFavorited(int $itemId, int $userId): bool;

    /** コメント一覧（ユーザー込み） */
    public function listComments(int $itemId): array;

    public function searchPublic(
        int $limit,
        int $page,
        ?string $keyword,
        ?int $viewerUserId,
    ): Items;

    public function findPublicItems(
    int $limit,
    int $page,
    ?string $keyword,
    ?int $viewerUserId
): Items;


    public function nextIdentity(): ItemId;

    public function save(Item $item): void;
}





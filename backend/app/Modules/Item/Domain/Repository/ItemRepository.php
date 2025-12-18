<?php

namespace App\Modules\Item\Domain\Repository;

use App\Modules\Item\Domain\Collection\Items;
use App\Modules\Item\Domain\Entity\Item;

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

}






    // 基本
//     public function listAll(?string $search, ?int $excludeUserId): iterable;
//     public function findById(int $id): ?Item;
//     public function save(Item $item): Item;
//     public function delete(int $id): void;

//     //各ショップごと
//     public function listByShop(int $shopId): iterable;
//     public function listByCartUser(int $userId): iterable;

//     public function updateStock(int $itemId, int $newRemain): void;
//     public function getStock(int $itemId): ?int;

//     //いいね・マイリスト機能
//     public function toggleMylist(int $userId, int $itemId): bool;
//     public function getFavoriteCount(int $itemId): int;


//     // コメント一覧（※名前を listComments に統一）
//     public function listComments(int $itemId): iterable;

//     public function searchByCategory(array $categories): iterable;
//     public function searchByBrand(string $brand): iterable;

//     //いいね機能
//     public function isFavorited(int $itemId, int $userId): bool;
//     public function findComments(int $itemId): array;
//     public function favoritesCount(int $itemId): int;

//     public function createComment(int $userId, int $itemId, string $comment): array;
// }

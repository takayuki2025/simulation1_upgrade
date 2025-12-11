<?php

namespace App\Modules\Item\Presentation\Domain\Repository;

use App\Modules\Item\Presentation\Domain\Entity\Item;

interface ItemRepository
{
    // 基本
    public function listAll(?string $search, ?int $excludeUserId): iterable;
    public function findById(int $id): ?Item;
    public function save(Item $item): Item;
    public function delete(int $id): void;

    // 拡張
    public function listByShop(int $shopId): iterable;
    public function listByCartUser(int $userId): iterable;

    public function updateStock(int $itemId, int $newRemain): void;
    public function getStock(int $itemId): ?int;

    public function toggleMylist(int $userId, int $itemId): bool;
    public function getFavoriteCount(int $itemId): int;

    public function listComments(int $itemId): iterable;

    public function searchByCategory(array $categories): iterable;
    public function searchByBrand(string $brand): iterable;

    public function isFavorited(int $itemId, int $userId): bool;
    public function findComments(int $itemId): array;
    public function favoritesCount(int $itemId): int;
}

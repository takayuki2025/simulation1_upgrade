<?php

namespace App\Modules\Search\Infrastructure\Persistence\Repository;

use App\Models\Item as EloquentItem;
use App\Modules\Search\Domain\Collection\SearchItems;
use App\Modules\Search\Domain\Repository\ItemSearchRepository;

final class EloquentItemSearchRepository implements ItemSearchRepository
{
    public function searchPublicItems(
        string $keyword,
        ?int $excludeUserId,
        int $limit,
        int $page
    ): SearchItems {
        $query = EloquentItem::query()
            ->where('name', 'LIKE', "%{$keyword}%");

        if ($excludeUserId !== null) {
            $query->where('user_id', '!=', $excludeUserId);
        }

        $items = $query
            ->orderByDesc('id')
            ->limit($limit)
            ->offset(($page - 1) * $limit)
            ->get();

        return SearchItems::fromEloquent($items);
    }
}

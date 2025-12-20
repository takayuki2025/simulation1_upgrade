<?php

namespace App\Modules\Item\Infrastructure\Persistence\Query;

use Illuminate\Support\Facades\DB;

final class ItemEntityTagReadRepository
{
    /**
     * 商品詳細用
     * 例:
     * [
     *   'brand' => ['Apple', '富士フィルム'],
     *   'condition' => ['美品'],
     *   'color' => ['青']
     * ]
     */
    public function getGroupedByItemId(int $itemId): array
    {
        $rows = DB::table('item_entity_tags')
            ->where('item_id', $itemId)
            ->orderByDesc('confidence')
            ->get();

        $grouped = [];

        foreach ($rows as $row) {
            $grouped[$row->entity_type][] = [
                'name'       => $row->canonical_name,
                'confidence' => $row->confidence,
            ];
        }

        return $grouped;
    }

    /**
     * 一覧検索用（brand など）
     */
    public function findItemIdsByTag(
        string $entityType,
        string $canonicalName
    ): array {
        return DB::table('item_entity_tags')
            ->where('entity_type', $entityType)
            ->where('canonical_name', $canonicalName)
            ->pluck('item_id')
            ->unique()
            ->values()
            ->toArray();
    }
}
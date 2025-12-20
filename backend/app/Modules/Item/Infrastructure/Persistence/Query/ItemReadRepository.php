<?php

namespace App\Modules\Item\Infrastructure\Persistence\Query;

use App\Models\Item;
use App\Modules\Item\Infrastructure\Persistence\Query\ItemEntityTagReadRepository;
use Illuminate\Support\Facades\DB;

final class ItemReadRepository
{
    public function findWithDisplayBrand(int $itemId)
    {
        return Item::query()
            ->leftJoin('item_entities', 'items.id', '=', 'item_entities.item_id')
            ->leftJoin(
                'brand_entities',
                'item_entities.brand_entity_id',
                '=',
                'brand_entities.id'
            )
            ->where('items.id', $itemId)
            ->select([
                'items.*',
                DB::raw('COALESCE(brand_entities.canonical_name, items.brand) as display_brand'),
            ])
            ->first();
    }

    public function paginateWithDisplayBrand(int $limit, int $page)
    {
        return Item::query()
            ->leftJoin('item_entities', function ($join) {
                $join->on('items.id', '=', 'item_entities.item_id')
                    ->where('item_entities.is_latest', true);
            })
            ->leftJoin(
                'brand_entities',
                'item_entities.brand_entity_id',
                '=',
                'brand_entities.id'
            )
            ->select([
                'items.*',
                DB::raw('COALESCE(brand_entities.canonical_name, items.brand) as display_brand'),
            ])
            ->paginate($limit, ['*'], 'page', $page);
    }

    /**
     * 商品詳細（entity 優先）
     */
    public function findWithDisplayEntities(int $itemId): ?array
    {
        $item = Item::with([
            'latestEntity.brand',
            'latestEntity.condition',
            'latestEntity.color',
            'entityTags'
        ])->find($itemId);

        if (!$item) {
            return null;
        }

        return [
            'id' => $item->id,
            'name' => $item->name,
            'price' => $item->price_amount,
            'brands' => $item->entityTags
                ->where('tag_type', 'brand')
                ->map(fn ($t) => $t->display_name)
                ->values()
                ->all(),
            'brand_primary' => optional($item->latestEntity?->brand)->canonical_name,
            'condition' => optional($item->latestEntity?->condition)->canonical_name,
            'color' => optional($item->latestEntity?->color)->canonical_name,
        ];
    }


    /**
     * 一覧（entity 優先）
     */
    public function paginateWithDisplayEntities(int $limit, int $page)
    {
        return Item::query()
            ->leftJoin('item_entities as ie', function ($join) {
                $join->on('items.id', '=', 'ie.item_id')
                     ->where('ie.is_latest', true);
            })
            ->leftJoin('brand_entities as be', 'ie.brand_entity_id', '=', 'be.id')
            ->leftJoin('condition_entities as ce', 'ie.condition_entity_id', '=', 'ce.id')
            ->leftJoin('color_entities as coe', 'ie.color_entity_id', '=', 'coe.id')
            ->select([
                'items.*',

                DB::raw('COALESCE(be.canonical_name, items.brand) as display_brand'),
                DB::raw('COALESCE(ce.canonical_name, items.condition) as display_condition'),
                DB::raw('coe.canonical_name as display_color'),
            ])
            ->paginate($limit, ['*'], 'page', $page);
    }

    private function loadTags(int $itemId): array
    {
        return DB::table('item_entity_tags')
            ->where('item_id', $itemId)
            ->select('entity_type', 'canonical_name')
            ->get()
            ->groupBy('entity_type')
            ->map(fn ($rows) => $rows->pluck('canonical_name')->values())
            ->toArray();
    }

    public function findWithDisplayEntitiesAndTags(
        int $itemId,
        ItemEntityTagReadRepository $tagRepo
    ): ?array {
        $item = $this->findWithDisplayEntities($itemId);

        if (!$item) {
            return null;
        }

        return [
            'item' => $item,
            'tags' => $tagRepo->getGroupedByItemId($itemId),
        ];
    }
}

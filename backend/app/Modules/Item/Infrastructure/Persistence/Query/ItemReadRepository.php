<?php

namespace App\Modules\Item\Infrastructure\Persistence\Query;

use App\Models\Item;
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

    public function findWithDisplayEntities(int $itemId)
    {
        return Item::query()
            ->leftJoin('item_entities', 'items.id', '=', 'item_entities.item_id')
            ->leftJoin('brand_entities', 'item_entities.brand_entity_id', '=', 'brand_entities.id')
            ->leftJoin('condition_entities', 'item_entities.condition_entity_id', '=', 'condition_entities.id')
            ->leftJoin('color_entities', 'item_entities.color_entity_id', '=', 'color_entities.id')
            ->where('items.id', $itemId)
            ->select([
                'items.*',
                DB::raw('COALESCE(brand_entities.canonical_name, items.brand) as display_brand'),
                DB::raw('condition_entities.canonical_name as display_condition'),
                DB::raw('color_entities.canonical_name as display_color'),
            ])
            ->first();
    }

    public function paginateWithDisplayEntities(int $limit, int $page)
    {
        return Item::query()
            ->leftJoin('item_entities', 'items.id', '=', 'item_entities.item_id')
            ->leftJoin('brand_entities', 'item_entities.brand_entity_id', '=', 'brand_entities.id')
            ->leftJoin('condition_entities', 'item_entities.condition_entity_id', '=', 'condition_entities.id')
            ->leftJoin('color_entities', 'item_entities.color_entity_id', '=', 'color_entities.id')
            ->select([
                'items.*',
                DB::raw('COALESCE(brand_entities.canonical_name, items.brand) as display_brand'),
                DB::raw('condition_entities.canonical_name as display_condition'),
                DB::raw('color_entities.canonical_name as display_color'),
            ])
            ->paginate($limit, ['*'], 'page', $page);
    }
}

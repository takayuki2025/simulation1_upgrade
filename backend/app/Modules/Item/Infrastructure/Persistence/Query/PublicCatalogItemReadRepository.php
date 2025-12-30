<?php

namespace App\Modules\Item\Infrastructure\Persistence\Query;

use App\Models\Item;
use App\Modules\Item\ReadModel\PublicCatalog\PublicCatalogItemDto;
use App\Modules\Item\ReadModel\PublicCatalog\PublicCatalogItemCollection;
use Illuminate\Support\Facades\DB;

final class PublicCatalogItemReadRepository
{
    public function paginate(
        int $limit,
        int $page,
        ?string $keyword,
        ?int $viewerShopId,
        ?int $viewerUserId
    ): PublicCatalogItemCollection {

        $query = Item::query()
            ->from('items')
            ->leftJoin('item_entities as ie', function ($join) {
                $join->on('items.id', '=', 'ie.item_id')
                     ->where('ie.is_latest', true);
            })
            ->leftJoin('brand_entities as be', 'ie.brand_entity_id', '=', 'be.id')
            ->leftJoin('condition_entities as ce', 'ie.condition_entity_id', '=', 'ce.id')
            ->leftJoin('color_entities as coe', 'ie.color_entity_id', '=', 'coe.id')
            ->select([
                'items.id',
                'items.name',
                'items.price',
                'items.item_image',
                'items.created_at',
                'items.shop_id',
                'items.created_by_user_id',
                DB::raw('be.canonical_name  as brand_primary'),
                DB::raw('ce.canonical_name  as condition_name'),
                DB::raw('coe.canonical_name as color_name'),
            ])
            ->orderByDesc('items.id');

        if ($keyword) {
            $query->where('items.name', 'LIKE', "%{$keyword}%");
        }

        /**
         * ✅ 除外は「自分の shop の商品」のみ
         * 個人出品は除外しない
         */
        if ($viewerShopId !== null) {
            $query->where(function ($q) use ($viewerShopId) {
                $q->whereNull('items.shop_id')
                  ->orWhere('items.shop_id', '!=', $viewerShopId);
            });
        }

        $rows = $query
            ->limit($limit)
            ->offset(($page - 1) * $limit)
            ->get();

        $items = $rows->map(function ($row) use ($viewerUserId) {

            // ✅ ★ここが抜けていた定義
            $isOwnPersonalItem =
                $viewerUserId !== null
                && (int) $row->created_by_user_id === $viewerUserId
                && $row->shop_id === null;

            return new PublicCatalogItemDto(
                id: (int) $row->id,
                name: (string) $row->name,
                price: (int) $row->price,
                brandPrimary: $row->brand_primary,
                conditionName: $row->condition_name,
                colorName: $row->color_name,
                itemImagePath: $this->normalizeStoragePath($row->item_image),
                publishedAt: $row->created_at,
                isOwnPersonalItem: $isOwnPersonalItem,
            );
        })->all();

        return new PublicCatalogItemCollection($items);
    }

    private function normalizeStoragePath(?string $raw): ?string
    {
        if (!$raw) {
            return null;
        }

        $path = preg_replace('#^https?://[^/]+/#', '', trim($raw));
        $path = preg_replace('#^/?storage/#', '', $path);
        $path = ltrim($path, '/');

        return $path !== '' ? $path : null;
    }
}

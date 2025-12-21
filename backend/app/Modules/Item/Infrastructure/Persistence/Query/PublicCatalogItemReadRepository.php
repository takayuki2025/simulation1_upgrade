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
        ?int $viewerShopId
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
                'items.shop_id',
                'items.name',
                'items.price',
                'items.item_image',
                'items.created_at',
                DB::raw('be.canonical_name  as brand_primary'),
                DB::raw('ce.canonical_name  as condition_name'),
                DB::raw('coe.canonical_name as color_name'),
            ])
            ->orderByDesc('items.id');

        if ($keyword) {
            // 最小：name LIKE。将来は fulltext / search service に移す
            $query->where('items.name', 'LIKE', "%{$keyword}%");
        }


        if ($viewerShopId !== null) {
            $query->where(function ($q) use ($viewerShopId) {
                $q->where('items.shop_id', '!=', $viewerShopId)
                  ->orWhereNull('items.shop_id'); // ← individual 出品を通す
            });
        }


        $rows = $query
            ->limit($limit)
            ->offset(($page - 1) * $limit)
            ->get();

        $items = $rows->map(function ($row) {
            return new PublicCatalogItemDto(
                id: (int) $row->id,
                name: (string) $row->name,
                price: (int) $row->price,
                brandPrimary: $row->brand_primary !== null ? (string) $row->brand_primary : null,
                conditionName: $row->condition_name !== null ? (string) $row->condition_name : null,
                colorName: $row->color_name !== null ? (string) $row->color_name : null,
                itemImagePath: $this->normalizeStoragePath($row->item_image),
                publishedAt: $row->created_at instanceof \DateTimeInterface
                    ? $row->created_at
                    : new \DateTimeImmutable((string) $row->created_at),
            );
        })->all();

        return new PublicCatalogItemCollection($items);
    }

    /**
     * items.item_image に以下が混在しても壊れないようにする：
     * - "item_images/xxx.jpg"（推奨）
     * - "/storage/item_images/xxx.jpg"
     * - "storage/item_images/xxx.jpg"
     * - "/item_images/xxx.jpg"
     */
    private function normalizeStoragePath(?string $raw): ?string
    {
        if (!$raw) {
            return null;
        }

        $path = trim($raw);

        // URL の場合は一旦パス部分だけに寄せたいが、まずは storage を優先して除去
        // "/storage/xxxx" / "storage/xxxx" を "xxxx" に
        $path = preg_replace('#^https?://[^/]+/#', '', $path); // host を落とす（混入してた場合）
        $path = preg_replace('#^/?storage/#', '', $path);
        $path = ltrim($path, '/');

        // "public/storage/..." のような混入にも備える
        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, strlen('storage/'));
        }

        return $path ?: null;
    }
}

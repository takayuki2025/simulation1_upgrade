<?php

namespace App\Modules\Shipment\Infrastructure\Persistence\Query;

use App\Modules\Shipment\Domain\Repository\ShipmentQueryRepository;
use Illuminate\Support\Facades\DB;

final class DbShipmentQueryRepository implements ShipmentQueryRepository
{
    public function findByShopId(int $shopId): array
    {
        return DB::table('shipments')
            ->join('orders', 'orders.id', '=', 'shipments.order_id')
            ->where('shipments.shop_id', $shopId)
            ->orderByDesc('shipments.id')
            ->select([
                // ===== Order =====
                'orders.id as order_id',
                'orders.status as order_status',
                'orders.total_amount',
                'orders.currency',
                'orders.user_id as buyer_user_id',
                'orders.address_confirmed_at',
                'orders.address_snapshot',

                // ===== Shipment =====
                'shipments.id as shipment_id',
                'shipments.status as shipment_status',
                'shipments.eta',
                'shipments.destination_address',
            ])
            ->get()
            ->map(function ($row) {
                $row = (array) $row;

                // JSON → array
                $row['destination_address'] = $row['destination_address']
                    ? json_decode($row['destination_address'], true)
                    : null;

                $row['address_snapshot'] = $row['address_snapshot']
                    ? json_decode($row['address_snapshot'], true)
                    : null;

                // 配送先名は Order の address_snapshot から組み立てる
                if ($row['address_snapshot']) {
                    $row['destination_address'] = array_merge(
                        $row['destination_address'] ?? [],
                        [
                            'name' => $row['address_snapshot']['name'] ?? null,
                        ]
                    );
                }

                return $row;
            })
            ->all();
    }


    public function findByShopIdAndOrderId(
        int $shopId,
        int $orderId
    ): ?array {
        $row = DB::table('shipments')
            ->where('shipments.shop_id', $shopId)
            ->where('shipments.order_id', $orderId)
            ->select([
                'shipments.id as shipment_id',
                'shipments.status as shipment_status',
                'shipments.eta',
            ])
            ->first();

        return $row ? (array)$row : null;
    }



    private function decodeJson(mixed $value): ?array
    {
        if ($value === null) {
            return null;
        }

        if (is_array($value)) {
            return $value;
        }

        if (is_string($value) && $value !== '') {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : null;
        }

        return null;
    }
}

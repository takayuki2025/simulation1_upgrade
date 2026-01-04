<?php

namespace App\Modules\Shipment\Infrastructure\Persistence\Query;

use App\Modules\Shipment\Domain\Repository\ShipmentQueryRepository;
use Illuminate\Support\Facades\DB;

final class DbShipmentQueryRepository implements ShipmentQueryRepository
{
    public function findByShopIdAndOrderId(
        int $shopId,
        int $orderId
    ): ?array {
        $row = DB::table('orders')
            ->leftJoin('payments', function ($join) {
                $join->on('payments.order_id', '=', 'orders.id')
                     ->where('payments.status', 'succeeded');
            })
            ->leftJoin('shipments', 'shipments.order_id', '=', 'orders.id')
            ->where('orders.shop_id', $shopId)
            ->where('orders.id', $orderId)
            ->select([
                'orders.id as order_id',

                // ★ ここが重要
                DB::raw('payments.id IS NOT NULL as order_paid'),

                'shipments.id as shipment_id',
                'shipments.status as shipment_status',
                'shipments.eta',

                'orders.address_snapshot as destination_address',
            ])
            ->first();

        if (! $row) {
            return null;
        }

        return [
            'order_id' => (int) $row->order_id,
            'order_paid' => (bool) $row->order_paid,   // ★ 必ず入る
            'shipment_id' => $row->shipment_id ? (int) $row->shipment_id : null,
            'shipment_status' => $row->shipment_status,
            'eta' => $row->eta,
            'destination_address' => $row->destination_address
                ? json_decode($row->destination_address, true)
                : null,
        ];
    }

    public function findByShopId(int $shopId): array
    {
        // 一覧用（今回は省略でOK）
        return [];
    }
}

<?php

namespace App\Modules\Order\Infrastructure\Persistence;

use App\Modules\Order\Domain\Repository\OrderQueryRepository;
use Illuminate\Support\Facades\DB;

final class EloquentOrderQueryRepository implements OrderQueryRepository
{
    /**
     * ============================
     * 注文一覧（Shipment 情報込み）
     * ============================
     */
    public function findOrderListWithShipmentByShopId(int $shopId): array
    {
        $rows = DB::table('orders')
            ->leftJoin('payments', function ($join) {
                $join->on('payments.order_id', '=', 'orders.id')
                     ->where('payments.status', 'succeeded');
            })
            ->leftJoin('shipments', 'shipments.order_id', '=', 'orders.id')
            ->where('orders.shop_id', $shopId)
            ->select([
                'orders.id as order_id',
                'orders.status as order_status',
                'orders.created_at as order_created_at', // ✅ 追加

                DB::raw('payments.id IS NOT NULL as order_paid'),

                'orders.total_amount',
                'orders.currency',

                'shipments.id as shipment_id',
                'shipments.status as shipment_status',
                'shipments.eta',

                'orders.address_snapshot as destination_address',
            ])
            ->orderByDesc('orders.id')
            ->get();

        return $rows->map(fn ($row) => [
            'order_id' => (int) $row->order_id,
            'order_status' => (string) $row->order_status,
            'order_created_at' => $row->order_created_at, // ✅ 追加
            'order_paid' => (bool) $row->order_paid,

            'total_amount' => (int) $row->total_amount,
            'currency' => (string) $row->currency,

            'shipment_id' => $row->shipment_id !== null
                ? (int) $row->shipment_id
                : null,

            'shipment_status' => $row->shipment_status,
            'eta' => $row->eta,

            'destination_address' => $row->destination_address
                ? json_decode($row->destination_address, true)
                : null,
        ])->all();
    }
}

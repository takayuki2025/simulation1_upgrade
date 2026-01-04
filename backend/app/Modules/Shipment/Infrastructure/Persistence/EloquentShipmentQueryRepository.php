<?php

namespace App\Modules\Shipment\Infrastructure\Persistence;

use App\Modules\Shipment\Domain\Repository\ShipmentQueryRepository;
use Illuminate\Support\Facades\DB;

final class EloquentShipmentQueryRepository implements ShipmentQueryRepository
{
    /**
     * ============================
     * 注文 + 配送（単一）
     * ============================
     */
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
                'orders.status as order_status',
                DB::raw('payments.id IS NOT NULL as order_paid'),

                'shipments.id as shipment_id',
                'shipments.status as shipment_status',
                'shipments.eta',

                'orders.address_snapshot as destination_address',
            ])
            ->first();

        return $row ? $this->normalizeRow($row) : null;
    }

    /**
     * ============================
     * 注文 + 配送（一覧）
     * ============================
     */
    public function findOrderShipmentListByShopId(int $shopId): array
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
                DB::raw('payments.id IS NOT NULL as order_paid'),

                'shipments.id as shipment_id',
                'shipments.status as shipment_status',
                'shipments.eta',

                'orders.address_snapshot as destination_address',
            ])
            ->orderByDesc('orders.id')
            ->get();

        return $rows
            ->map(fn ($row) => $this->normalizeRow($row))
            ->all();
    }

    /**
     * ============================
     * 共通正規化
     * ============================
     */
    private function normalizeRow(object $row): array
    {
        return [
            'order_id' => (int) $row->order_id,
            'order_status' => (string) $row->order_status,
            'order_paid' => (bool) $row->order_paid,

            'shipment_id' => $row->shipment_id !== null
                ? (int) $row->shipment_id
                : null,

            'shipment_status' => $row->shipment_status,
            'eta' => $row->eta,

            'destination_address' => $row->destination_address
                ? json_decode($row->destination_address, true)
                : null,
        ];
    }
}

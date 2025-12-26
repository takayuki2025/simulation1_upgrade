<?php

namespace App\Modules\Shipment\Infrastructure\Persistence\Query;

use App\Modules\Shipment\Domain\Repository\ShipmentManagementQueryRepository;
use Illuminate\Support\Facades\DB;

final class DbShipmentManagementQueryRepository implements ShipmentManagementQueryRepository
{
    public function findByShopId(int $shopId): array
    {
        // orders を主、shipments を従（LEFT JOIN）
        $rows = DB::table('orders')
            ->leftJoin('shipments', 'shipments.order_id', '=', 'orders.id')
            ->where('orders.shop_id', $shopId)
            ->orderByDesc('orders.id')
            ->select([
                'orders.id as order_id',
                'orders.status as order_status',
                'orders.total_amount',
                'orders.currency',
                'orders.user_id as buyer_user_id',
                'orders.address_snapshot_at',

                'shipments.id as shipment_id',
                'shipments.status as shipment_status',
                'shipments.eta',
                'shipments.destination_address',
            ])
            ->get();

        return $rows->map(function ($r) {
            return [
                'order_id' => (int) $r->order_id,
                'order_status' => (string) $r->order_status,
                'total_amount' => (int) $r->total_amount,
                'currency' => (string) $r->currency,
                'buyer_user_id' => (int) $r->buyer_user_id,
                'address_snapshot_at' => $r->address_snapshot_at ? (string) $r->address_snapshot_at : null,

                'shipment_id' => $r->shipment_id ? (int) $r->shipment_id : null,
                'shipment_status' => $r->shipment_status ? (string) $r->shipment_status : null,
                'eta' => $r->eta ? (string) $r->eta : null,

                // DB側は json 文字列の可能性があるので decode
                'destination_address' => $this->decodeJson($r->destination_address),
            ];
        })->all();
    }

    private function decodeJson(mixed $value): ?array
    {
        if ($value === null) {
            return null;
        }

        // すでに配列ならそのまま
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

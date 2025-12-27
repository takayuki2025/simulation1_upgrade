<?php

namespace App\Modules\Shipment\Infrastructure\Persistence\Query;

use App\Modules\Shipment\Domain\Repository\ShipmentManagementQueryRepository;
use Illuminate\Support\Facades\DB;

final class DbShipmentManagementQueryRepository implements ShipmentManagementQueryRepository
{
    public function findByShopId(int $shopId): array
    {
        $rows = DB::table('shipments')
            ->join('orders', 'orders.id', '=', 'shipments.order_id')
            ->where('shipments.shop_id', $shopId)
            ->orderByDesc('shipments.id')
            ->select([
                'orders.id as order_id',
                'orders.status as order_status',
                'orders.total_amount',
                'orders.currency',
                'orders.user_id as buyer_user_id',
                'orders.address_confirmed_at', // ✅ 正しい

                'shipments.id as shipment_id',
                'shipments.status as shipment_status',
                'shipments.eta',
                'shipments.destination_address',
            ])
            ->get();

        return $rows->map(fn ($r) => [
            'order_id' => (int) $r->order_id,
            'order_status' => (string) $r->order_status,
            'total_amount' => (int) $r->total_amount,
            'currency' => (string) $r->currency,
            'buyer_user_id' => (int) $r->buyer_user_id,
            'address_confirmed_at' => $r->address_confirmed_at
                ? (string) $r->address_confirmed_at
                : null,

            'shipment_id' => (int) $r->shipment_id,
            'shipment_status' => (string) $r->shipment_status,
            'eta' => $r->eta ? (string) $r->eta : null,
            'destination_address' => $this->decodeJson($r->destination_address),
        ])->all();
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

<?php

namespace App\Modules\Shipment\Infrastructure\Persistence;

use App\Modules\Shipment\Domain\Entity\Shipment;
use App\Modules\Shipment\Domain\Enum\ShipmentStatus;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shop\Domain\Repository\ShopRepository;
use App\Modules\Shipment\Infrastructure\Persistence\Models\ShipmentModel;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

final class EloquentShipmentRepository implements ShipmentRepository
{
    public function __construct(
        private ShopRepository $shops // shop_code → shop_id 解決用
    ) {
    }

    public function save(Shipment $shipment): Shipment
    {
        if ($shipment->id === null) {
            $id = DB::table('shipments')->insertGetId([
                'shop_id' => $shipment->shopId,
                'order_id' => $shipment->orderId,
                'status' => $shipment->status->value,
                'origin_address' => json_encode($shipment->originAddress, JSON_UNESCAPED_UNICODE),
                'destination_address' => json_encode($shipment->destinationAddress, JSON_UNESCAPED_UNICODE),
                'eta' => $shipment->eta?->toDateTimeString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $shipment->id = (int) $id;
            return $shipment;
        }

        DB::table('shipments')
            ->where('id', $shipment->id)
            ->update([
                'status' => $shipment->status->value,
                'origin_address' => json_encode($shipment->originAddress, JSON_UNESCAPED_UNICODE),
                'destination_address' => json_encode($shipment->destinationAddress, JSON_UNESCAPED_UNICODE),
                'eta' => $shipment->eta?->toDateTimeString(),
                'updated_at' => now(),
            ]);

        return $shipment;
    }

    public function findByOrderId(int $orderId): ?Shipment
    {
        $row = DB::table('shipments')
            ->where('order_id', $orderId)
            ->first();

        if (!$row) {
            return null;
        }

        return new Shipment(
            id: (int) $row->id,
            shopId: (int) $row->shop_id,
            orderId: (int) $row->order_id,
            status: ShipmentStatus::from((string) $row->status),
            originAddress: $row->origin_address ? json_decode($row->origin_address, true) : [],
            destinationAddress: $row->destination_address ? json_decode($row->destination_address, true) : [],
            eta: $row->eta ? Carbon::parse($row->eta) : null,
        );
    }

    public function existsByOrderId(int $orderId): bool
    {
        return DB::table('shipments')
            ->where('order_id', $orderId)
            ->exists();
    }

    public function findByShopAndOrder(string $shopCode, int $orderId): ?array
    {
        $shop = $this->shops->findByCode($shopCode);
        if (!$shop) {
            return null;
        }

        $m = ShipmentModel::query()
            ->where('shop_id', $shop->id())
            ->where('order_id', $orderId)
            ->first();

        if (!$m) {
            return null;
        }

        return [
            'id' => (int) $m->id,
            'status' => (string) $m->status,
            'eta' => $m->eta?->toDateString(),
        ];
    }

    public function findById(int $shipmentId): ?array
    {
        $m = ShipmentModel::find($shipmentId);
        if (!$m) {
            return null;
        }

        return [
            'id' => (int) $m->id,
            'status' => (string) $m->status,
            'eta' => $m->eta?->toDateString(),
        ];
    }
}

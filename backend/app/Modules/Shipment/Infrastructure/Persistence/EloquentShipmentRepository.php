<?php

namespace App\Modules\Shipment\Infrastructure\Persistence;

use App\Modules\Shipment\Domain\Entity\Shipment;
use App\Modules\Shipment\Domain\Enum\ShipmentStatus;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Carbon\Carbon;

final class EloquentShipmentRepository implements ShipmentRepository
{
    public function findById(int $shipmentId): Shipment
    {
        $row = DB::table('shipments')->where('id', $shipmentId)->first();

        if (! $row) {
            throw new RuntimeException('Shipment not found');
        }

        return new Shipment(
            id: (int) $row->id,
            shopId: (int) $row->shop_id,
            orderId: (int) $row->order_id,
            status: ShipmentStatus::from($row->status),
            originAddress: $this->decodeJson($row->origin_address),
            destinationAddress: $this->decodeJson($row->destination_address),
            eta: $row->eta ? Carbon::parse($row->eta) : null,
        );
    }

    public function save(Shipment $shipment): Shipment
    {
        if ($shipment->id === null) {
            $id = DB::table('shipments')->insertGetId([
                'shop_id' => $shipment->shopId,
                'order_id' => $shipment->orderId,
                'status' => $shipment->status->value,
                'origin_address' => json_encode($shipment->originAddress),
                'destination_address' => json_encode($shipment->destinationAddress),
                'eta' => $shipment->eta?->toDateTimeString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $shipment->id = $id;
            return $shipment;
        }

        DB::table('shipments')
            ->where('id', $shipment->id)
            ->update([
                'status' => $shipment->status->value,
                'updated_at' => now(),
            ]);

        return $shipment;
    }

    public function findByOrderId(int $orderId): ?Shipment
    {
        $row = DB::table('shipments')->where('order_id', $orderId)->first();
        return $row ? $this->findById($row->id) : null;
    }

    public function existsByOrderId(int $orderId): bool
    {
        return DB::table('shipments')->where('order_id', $orderId)->exists();
    }

    private function decodeJson(mixed $value): array
    {
        if (is_array($value)) {
            return $value;
        }
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }
        return [];
    }

    public function createForOrder(
        int $shopId,
        int $orderId
    ): Shipment {
        $id = DB::table('shipments')->insertGetId([
            'shop_id' => $shopId,
            'order_id' => $orderId,
            'status' => ShipmentStatus::CREATED->value,
            'origin_address' => json_encode([]),
            'destination_address' => json_encode([]),
            'eta' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $this->findById($id);
    }
}

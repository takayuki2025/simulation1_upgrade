<?php

namespace App\Modules\Shipment\Infrastructure\Persistence;

use App\Modules\Shipment\Domain\Entity\Shipment;
use App\Modules\Shipment\Domain\Enum\ShipmentStatus;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Infrastructure\Persistence\Models\ShipmentModel;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

final class EloquentShipmentRepository implements ShipmentRepository
{
    public function create(
        int $shopId,
        int $orderId,
        array $origin,
        array $destination,
        Carbon $eta
    ): Shipment {
        $id = DB::table('shipments')->insertGetId([
            'shop_id' => $shopId,
            'order_id' => $orderId,
            'status' => ShipmentStatus::CREATED->value,
            'origin_address' => json_encode($origin),
            'destination_address' => json_encode($destination),
            'eta' => $eta,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $this->find($id);
    }

    public function find(int $id): ?Shipment
    {
        $row = DB::table('shipments')->where('id', $id)->first();
        if (!$row) {
            return null;
        }

        return new Shipment(
            $row->id,
            $row->shop_id,
            $row->order_id,
            ShipmentStatus::from($row->status),
            json_decode($row->origin_address, true),
            json_decode($row->destination_address, true),
            $row->eta ? Carbon::parse($row->eta) : null,
        );
    }

    public function save(Shipment $shipment): void
    {
        DB::table('shipments')->where('id', $shipment->id)->update([
            'status' => $shipment->status->value,
            'eta' => $shipment->eta,
            'updated_at' => now(),
        ]);
    }

    public function findByOrderId(int $orderId): ?Shipment
    {
        $model = ShipmentModel::where('order_id', $orderId)->first();

        return $model ? $this->toEntity($model) : null;
    }

    private function toEntity(ShipmentModel $model): Shipment
    {
        return Shipment::reconstitute(
            id: (int) $model->id,
            orderId: (int) $model->order_id,
            status: $model->status,
            eta: $model->eta,
            createdAt: $model->created_at
                ? new \DateTimeImmutable($model->created_at)
                : null
        );
    }
}

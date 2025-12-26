<?php

namespace App\Modules\Shipment\Domain\Entity;

use App\Modules\Shipment\Domain\Enum\ShipmentStatus;
use DomainException;
use Carbon\Carbon;

final class Shipment
{
    public function __construct(
        public ?int $id,
        public int $shopId,
        public int $orderId,
        public ShipmentStatus $status,
        public array $originAddress,
        public array $destinationAddress,
        public ?Carbon $eta,
    ) {
    }

    /**
     * OrderPaid 時点で生成される初期 Shipment
     * 配送先のみ確定（Order からコピー）
     */
    public static function createInitial(
        int $shopId,
        int $orderId,
        array $destinationAddress
    ): self {
        return new self(
            id: null,
            shopId: $shopId,
            orderId: $orderId,
            status: ShipmentStatus::CREATED,
            originAddress: [],
            destinationAddress: $destinationAddress,
            eta: null,
        );
    }

    /* ===== State Transitions ===== */

    public function pack(): void
    {
        $this->assertStatus(ShipmentStatus::CREATED);
        $this->status = ShipmentStatus::PACKED;
    }

    public function ship(): void
    {
        $this->assertStatus(ShipmentStatus::PACKED);
        $this->status = ShipmentStatus::SHIPPED;
    }

    public function markInTransit(): void
    {
        $this->assertStatus(ShipmentStatus::SHIPPED);
        $this->status = ShipmentStatus::IN_TRANSIT;
    }

    public function deliver(): void
    {
        $this->assertStatus(ShipmentStatus::IN_TRANSIT);
        $this->status = ShipmentStatus::DELIVERED;
    }

    private function assertStatus(ShipmentStatus $expected): void
    {
        if ($this->status !== $expected) {
            throw new DomainException('Invalid shipment state transition');
        }
    }
}

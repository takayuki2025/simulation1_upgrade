<?php

namespace App\Modules\Shipment\Domain\Entity;

use App\Modules\Shipment\Domain\Enum\ShipmentStatus;
use DomainException;

final class Shipment
{
    public function __construct(
        public ?int $id,
        public int $shopId,
        public int $orderId,
        public ShipmentStatus $status,
        public array $originAddress,
        public array $destinationAddress,
        public ?\DateTimeImmutable $eta,
    ) {
    }

    public static function createInitial(
        int $shopId,
        int $orderId,
        array $destinationAddress,
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

    public function pack(): void
    {
        if ($this->status !== ShipmentStatus::CREATED) {
            throw new DomainException(sprintf(
                'Invalid shipment state transition: %s → packed',
                $this->status->value
            ));
        }

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

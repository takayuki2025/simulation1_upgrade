<?php

namespace App\Modules\Shipment\Domain\Event;

final class ShipmentEvent
{
    public function __construct(
        public readonly int $shipmentId,
        public readonly ShipmentEventType $type,
        public readonly array $payload,
        public readonly \DateTimeImmutable $occurredAt,
    ) {
    }

    // --------------------
    // Static factories
    // --------------------

    public static function packed(int $shipmentId): self
    {
        return new self(
            shipmentId: $shipmentId,
            type: ShipmentEventType::PACKED,
            payload: [],
            occurredAt: new \DateTimeImmutable(), // ★ここ
        );
    }

    public static function shipped(int $shipmentId): self
    {
        return new self(
            shipmentId: $shipmentId,
            type: ShipmentEventType::SHIPPED,
            payload: [],
            occurredAt: new \DateTimeImmutable(),
        );
    }

    public static function inTransit(int $shipmentId): self
    {
        return new self(
            shipmentId: $shipmentId,
            type: ShipmentEventType::IN_TRANSIT,
            payload: [],
            occurredAt: new \DateTimeImmutable(),
        );
    }

    public static function delivered(int $shipmentId): self
    {
        return new self(
            shipmentId: $shipmentId,
            type: ShipmentEventType::DELIVERED,
            payload: [],
            occurredAt: new \DateTimeImmutable(),
        );
    }
}

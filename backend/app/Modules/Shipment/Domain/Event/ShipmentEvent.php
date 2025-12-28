<?php

namespace App\Modules\Shipment\Domain\Event;

final class ShipmentEvent
{
    private function __construct(
        public readonly int $shipmentId,
        public readonly string $type,
        public readonly array $payload,
        public readonly \DateTimeImmutable $occurredAt,
    ) {
    }

    public static function packed(int $shipmentId): self
    {
        return new self(
            $shipmentId,
            ShipmentEventType::PACKED->value,
            [],
            new \DateTimeImmutable()
        );
    }

    public static function shipped(int $shipmentId): self
    {
        return new self(
            $shipmentId,
            ShipmentEventType::SHIPPED->value,
            [],
            new \DateTimeImmutable()
        );
    }

    public static function delivered(int $shipmentId): self
    {
        return new self(
            $shipmentId,
            ShipmentEventType::DELIVERED->value,
            [],
            new \DateTimeImmutable()
        );
    }
}

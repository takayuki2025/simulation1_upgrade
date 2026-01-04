<?php

namespace App\Modules\Shipment\Domain\Entity;

use App\Modules\Shipment\Domain\Enum\ShipmentStatus;
use App\Modules\Order\Domain\ValueObject\Address;
use DomainException;

final class Shipment
{
    private function __construct(
        private ?int $id,
        private int $shopId,
        private int $orderId,
        private ShipmentStatus $status,
        private Address $originAddress,
        private Address $destinationAddress,
        private ?\DateTimeImmutable $eta,
    ) {
    }

    /* ============================
       Factory
    ============================ */

    public static function createDraft(
        int $shopId,
        int $orderId,
        Address $originAddress,
        Address $destinationAddress,
    ): self {
        return new self(
            null,
            $shopId,
            $orderId,
            ShipmentStatus::DRAFT,
            $originAddress,
            $destinationAddress,
            null,
        );
    }

    public static function reconstitute(
        int $id,
        int $shopId,
        int $orderId,
        ShipmentStatus $status,
        Address $originAddress,
        Address $destinationAddress,
        ?\DateTimeImmutable $eta,
    ): self {
        return new self(
            $id,
            $shopId,
            $orderId,
            $status,
            $originAddress,
            $destinationAddress,
            $eta,
        );
    }

    /* ============================
       Getters
    ============================ */

    public function id(): ?int
    {
        return $this->id;
    }
    public function shopId(): int
    {
        return $this->shopId;
    }
    public function orderId(): int
    {
        return $this->orderId;
    }
    public function status(): ShipmentStatus
    {
        return $this->status;
    }
    public function eta(): ?\DateTimeImmutable
    {
        return $this->eta;
    }
    public function originAddress(): Address
    {
        return $this->originAddress;
    }
    public function destinationAddress(): Address
    {
        return $this->destinationAddress;
    }

    /* ============================
       State transitions
    ============================ */

    /** DRAFT → PACKED */
    public function pack(): self
    {
        if ($this->status !== ShipmentStatus::DRAFT) {
            throw new DomainException("Cannot pack from {$this->status->value}");
        }

        return self::reconstitute(
            $this->id,
            $this->shopId,
            $this->orderId,
            ShipmentStatus::PACKED,
            $this->originAddress,
            $this->destinationAddress,
            null,
        );
    }

    /** PACKED → SHIPPED */
    public function ship(\DateTimeImmutable $eta): self
    {
        if ($this->status !== ShipmentStatus::PACKED) {
            throw new DomainException("Cannot ship from {$this->status->value}");
        }

        return self::reconstitute(
            $this->id,
            $this->shopId,
            $this->orderId,
            ShipmentStatus::SHIPPED,
            $this->originAddress,
            $this->destinationAddress,
            $eta,
        );
    }

    public function markInTransit(): self
    {
        if (! $this->status->isShipped()) {
            throw new DomainException(
                'Cannot mark in_transit from ' . $this->status->value
            );
        }

        return self::reconstitute(
            id: $this->id,
            shopId: $this->shopId,
            orderId: $this->orderId,
            status: ShipmentStatus::IN_TRANSIT,
            originAddress: $this->originAddress,
            destinationAddress: $this->destinationAddress,
            eta: $this->eta, // ← OK（ETAは保持）
        );
    }

    public function deliver(): self
    {
        if (! $this->status->isInTransit()) {
            throw new DomainException(
                'Cannot deliver from ' . $this->status->value
            );
        }

        return self::reconstitute(
            id: $this->id,
            shopId: $this->shopId,
            orderId: $this->orderId,
            status: ShipmentStatus::DELIVERED,
            originAddress: $this->originAddress,
            destinationAddress: $this->destinationAddress,
            eta: $this->eta,
        );
    }
}

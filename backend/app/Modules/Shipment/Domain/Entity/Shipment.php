<?php

namespace App\Modules\Shipment\Domain\Entity;

use App\Modules\Shipment\Domain\Enum\ShipmentStatus;
use App\Modules\Order\Domain\ValueObject\Address;

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
            id: null,
            shopId: $shopId,
            orderId: $orderId,
            status: ShipmentStatus::DRAFT,
            originAddress: $originAddress,
            destinationAddress: $destinationAddress,
            eta: null,
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
            id: $id,
            shopId: $shopId,
            orderId: $orderId,
            status: $status,
            originAddress: $originAddress,
            destinationAddress: $destinationAddress,
            eta: $eta,
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
    public function originAddress(): Address
    {
        return $this->originAddress;
    }
    public function destinationAddress(): Address
    {
        return $this->destinationAddress;
    }
    public function eta(): ?\DateTimeImmutable
    {
        return $this->eta;
    }

    /* ============================
       State transitions（将来拡張）
    ============================ */

    public function pack(): self
    {
        if ($this->status !== ShipmentStatus::DRAFT) {
            throw new DomainException('Cannot pack from ' . $this->status->value);
        }

        return self::reconstitute(
            id: $this->id,
            shopId: $this->shopId,
            orderId: $this->orderId,
            status: ShipmentStatus::PACKED,
            originAddress: $this->originAddress,
            destinationAddress: $this->destinationAddress,
            eta: null,
        );
    }

    public function markShipped(\DateTimeImmutable $eta): self
    {
        if ($this->id === null) {
            throw new \LogicException('Cannot ship a non-persisted Shipment');
        }

        return self::reconstitute(
            id: $this->id,
            shopId: $this->shopId,
            orderId: $this->orderId,
            status: ShipmentStatus::SHIPPED,
            originAddress: $this->originAddress,
            destinationAddress: $this->destinationAddress,
            eta: $eta,
        );
    }
}

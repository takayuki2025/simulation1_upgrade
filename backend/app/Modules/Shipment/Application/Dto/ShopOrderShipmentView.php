<?php

namespace App\Modules\Shipment\Application\Dto;

final class ShopOrderShipmentView
{
    public function __construct(
        public readonly int $orderId,
        public readonly string $status,
        public readonly ?int $shipmentId,
        public readonly ?string $eta,
        public readonly bool $canCreate,
        public readonly ?string $nextActionKey,
        public readonly ?string $nextActionLabel,
        public readonly ?array $destinationAddress,
    ) {
    }

    /* ============================
       Named constructors
    ============================ */

    /**
     * 未作成（未入金・コンビニ等）
     */
    public static function notCreated(
        int $orderId,
        bool $canCreate = false,
        ?array $destinationAddress = null
    ): self {
        return new self(
            orderId: $orderId,
            status: 'not_created',
            shipmentId: null,
            eta: null,
            canCreate: $canCreate,
            nextActionKey: null,
            nextActionLabel: null,
            destinationAddress: $destinationAddress,
        );
    }

    /**
     * 入金済み・受付待ち（draft）
     */
    public static function draft(
        int $orderId,
        ?array $destinationAddress
    ): self {
        return new self(
            orderId: $orderId,
            status: 'draft',
            shipmentId: null,
            eta: null,
            canCreate: true,
            nextActionKey: 'accept',
            nextActionLabel: '注文受付 / 在庫確保',
            destinationAddress: $destinationAddress,
        );
    }

    public static function pack(
        int $orderId,
        int $shipmentId,
        ?array $destinationAddress
    ): self {
        return new self(
            orderId: $orderId,
            status: 'pack',
            shipmentId: $shipmentId,
            eta: null,
            canCreate: false,
            nextActionKey: 'ship',
            nextActionLabel: '発送',
            destinationAddress: $destinationAddress,
        );
    }

    public static function shipped(
        int $orderId,
        int $shipmentId,
        ?string $eta,
        ?array $destinationAddress
    ): self {
        return new self(
            orderId: $orderId,
            status: 'shipped',
            shipmentId: $shipmentId,
            eta: $eta,
            canCreate: false,
            nextActionKey: 'in-transit',
            nextActionLabel: '輸送中',
            destinationAddress: $destinationAddress,
        );
    }

    public static function inTransit(
        int $orderId,
        int $shipmentId,
        ?string $eta,
        ?array $destinationAddress
    ): self {
        return new self(
            orderId: $orderId,
            status: 'in_transit',
            shipmentId: $shipmentId,
            eta: $eta,
            canCreate: false,
            nextActionKey: 'deliver',
            nextActionLabel: '配達完了',
            destinationAddress: $destinationAddress,
        );
    }

    public static function delivered(
        int $orderId,
        int $shipmentId,
        ?string $eta,
        ?array $destinationAddress
    ): self {
        return new self(
            orderId: $orderId,
            status: 'delivered',
            shipmentId: $shipmentId,
            eta: $eta,
            canCreate: false,
            nextActionKey: null,
            nextActionLabel: null,
            destinationAddress: $destinationAddress,
        );
    }

    /**
     * Shipment あり（通常状態）
     */
    public static function fromShipment(
        int $orderId,
        int $shipmentId,
        string $status,
        ?string $eta,
        ?string $nextActionKey,
        ?string $nextActionLabel,
        ?array $destinationAddress
    ): self {
        return new self(
            orderId: $orderId,
            status: $status,
            shipmentId: $shipmentId,
            eta: $eta,
            canCreate: false,
            nextActionKey: $nextActionKey,
            nextActionLabel: $nextActionLabel,
            destinationAddress: $destinationAddress,
        );
    }

    /* ============================
       Output
    ============================ */

    public function toArray(): array
    {
        return [
            'order_id' => $this->orderId,
            'shipment_id' => $this->shipmentId,
            'status' => $this->status,
            'eta' => $this->eta,
            'can_create' => $this->canCreate,
            'next_action' => $this->nextActionKey
                ? [
                    'key' => $this->nextActionKey,
                    'label' => $this->nextActionLabel,
                ]
                : null,
            'destination_address' => $this->destinationAddress,
        ];
    }
}

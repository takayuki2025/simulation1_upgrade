<?php


namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Application\Dto\CreateShipmentDraftInput;
use App\Modules\Shipment\Domain\Entity\Shipment;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Order\Domain\Repository\OrderRepository;
use Illuminate\Database\QueryException;

final class CreateShipmentDraftUseCase
{
    public function __construct(
        private OrderRepository $orders,
        private ShipmentRepository $shipments,
    ) {
    }

    public function handle(CreateShipmentDraftInput $input): void
    {
        $order = $this->orders->findById($input->orderId);
        if (! $order) {
            return;
        }

        $destination = $order->shippingAddress();
        if ($destination === null) {
            return;
        }

        if ($this->shipments->existsByOrderId($order->id())) {
            return;
        }

        $shipment = Shipment::createDraft(
            shopId: $order->shopId(),
            orderId: $order->id(),
            originAddress: $order->shopAddress(),
            destinationAddress: $destination,
        );

        try {
            $this->shipments->save($shipment);
        } catch (QueryException $e) {
            if ((int)($e->errorInfo[1] ?? 0) === 1062) {
                return; // 冪等
            }
            throw $e;
        }
    }
}

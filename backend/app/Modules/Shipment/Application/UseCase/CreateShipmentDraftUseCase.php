<?php

namespace App\Modules\Shipment\Application\UseCase;

use App\Modules\Shipment\Application\Dto\CreateShipmentDraftInput;
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Domain\Entity\Shipment;
use App\Modules\Shipment\Domain\Enum\ShipmentStatus;
use App\Modules\Order\Domain\Repository\OrderRepository;
use DomainException;
use Illuminate\Support\Facades\DB;

/**
 * OrderPaid を契機に Shipment Draft を作る（Aフェーズ）
 *
 * - まずは「1注文=1配送」前提で Draft を作る
 * - A+B/B フェーズで split shipment を追加していく
 */
final class CreateShipmentDraftUseCase
{
    public function __construct(
        private OrderRepository $orders,         // まずは直参照（後で Port 化してもOK）
        private ShipmentRepository $shipments,
    ) {
    }

    public function handle(CreateShipmentDraftInput $input): void
    {
        DB::transaction(function () use ($input) {

            $order = $this->orders->findById($input->orderId);
            if (! $order) {
                throw new DomainException('Order not found');
            }

            // shopId の整合（イベント改竄/誤配線防止）
            if ($order->shopId() !== $input->shopId) {
                throw new DomainException('Shop mismatch');
            }

            // Address が無い注文は配送できない（設計上はここに来ないが二重防御）
            if ($order->shippingAddress() === null) {
                throw new DomainException('Shipping address is missing');
            }

            // 冪等：すでに shipment が存在するなら何もしない（Aフェーズの最重要）
            $existing = $this->shipments->findByOrderId($order->id() ?? 0);
            if ($existing) {
                return;
            }

            // Draft を作成（配送はまだ開始していない）
            $shipment = Shipment::createDraft(
                orderId: $order->id() ?? 0,
                shopId: $order->shopId(),
                status: ShipmentStatus::DRAFT,
                address: $order->shippingAddress(), // Address VO をスナップショットとしてコピーする設計に寄せる
                meta: [
                    'order_paid_at' => null,
                ],
            );

            $this->shipments->save($shipment);
        });
    }
}

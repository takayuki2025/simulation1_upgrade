<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Modules\Shipment\Domain\Repository\ShipmentQueryRepository;
use App\Modules\Shop\Application\Dto\ShopContext;
use App\Modules\Order\Domain\Repository\OrderRepository;

final class ShopOrderShipmentController extends Controller
{
    public function __construct(
        private ShipmentQueryRepository $shipments,
        private OrderRepository $orders,
    ) {
    }

    public function __invoke(
        Request $request,
        string $shop_code,
        string $orderId
    ) {
        /** @var ShopContext|null $ctx */
        $ctx = $request->attributes->get(ShopContext::class);

        if (! $ctx) {
            abort(500, 'ShopContext not resolved');
        }

        $orderId = (int) $orderId;

        // ---- Order 確認（Aフェーズの可否判定用）
        $order = $this->orders->findById($orderId);

        if (! $order || $order->shopId() !== $ctx->shopId) {
            abort(404);
        }

        // ---- Shipment 取得
        $row = $this->shipments->findByShopIdAndOrderId(
            shopId: $ctx->shopId,
            orderId: $orderId
        );

        // ---- Aフェーズ：未作成
        if (! $row) {
            return response()->json([
                'shipment_id' => null,
                'status'      => 'not_created',
                'eta'         => null,
                'can_create'  => $order->isPaid(), // ★ ここが肝
            ]);
        }

        // ---- Shipment あり
        return response()->json([
            'shipment_id' => $row['shipment_id'],
            'status'      => $row['shipment_status'],
            'eta'         => $row['eta'],
            'can_create'  => false,
        ]);
    }
}

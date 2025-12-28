<?php

namespace App\Modules\Order\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Modules\Shipment\Domain\Repository\ShipmentQueryRepository;

final class ShopOrderShipmentController extends Controller
{
    public function __construct(
        private ShipmentQueryRepository $shipments
    ) {
    }

    public function __invoke(
        Request $request,
        string $shop_code,
        int $orderId
    ) {
        $shop = $request->attributes->get('currentShop');

        $row = $this->shipments->findByShopIdAndOrderId(
            shopId: $shop->id(),
            orderId: $orderId
        );

        if (! $row) {
            return response()->json([
                'shipment_id' => null,
            ], 200);
        }

        return response()->json([
            'shipment_id'     => $row['shipment_id'],
            'shipment_status' => $row['shipment_status'],
            'eta'             => $row['eta'],
        ], 200);
    }
}

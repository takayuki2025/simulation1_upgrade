<?php

namespace App\Modules\Shipment\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Modules\Shipment\Application\UseCase\CreateShipmentUseCase;

final class ShipmentController extends Controller
{
    public function __construct(
        private CreateShipmentUseCase $useCase
    ) {
    }

    public function store(
        Request $request,
        string $shop_code,   // ← 必ず受ける
        int $orderId         // ← int で受ける
    ) {
        /** @var \App\Modules\Shop\Domain\Entity\Shop $shop */
        $shop = $request->attributes->get('currentShop');

        $this->useCase->handle(
            orderId: $orderId,
            shopId: $shop->id(),
        );

        return response()->json([
            'status' => 'ok',
        ], 201);
    }
}

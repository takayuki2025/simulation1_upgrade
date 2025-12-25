<?php

namespace App\Modules\Shipment\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Shipment\Application\UseCase\CreateShipmentUseCase;
use App\Modules\Shipment\Application\UseCase\PackShipmentUseCase;

final class ShipmentController extends Controller
{
    public function store(Request $request, CreateShipmentUseCase $useCase)
    {
        $useCase->handle(
            shopId: $request->integer('shop_id'),
            orderId: $request->integer('order_id'),
            origin: $request->input('origin'),
            destination: $request->input('destination'),
        );

        return response()->json(['status' => 'created']);
    }

    public function pack(int $id, PackShipmentUseCase $useCase)
    {
        $useCase->handle($id);
        return response()->json(['status' => 'packed']);
    }
}

<?php

namespace App\Modules\Shipment\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Shipment\Application\UseCase\UpdateShipmentStatusUseCase;
use DomainException;

final class PackShipmentController extends Controller
{
    public function __invoke(
        int $shipmentId,
        UpdateShipmentStatusUseCase $useCase
    ) {
        try {
            $useCase->pack($shipmentId);

            return response()->json([
                'result' => 'ok',
            ]);
        } catch (DomainException $e) {
            return response()->json([
                'error' => 'invalid_state',
                'message' => $e->getMessage(),
            ], 409); // ← ★400 ではなく 409 Conflict
        }
    }
}

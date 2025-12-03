<?php

namespace App\Http\Controllers;

use App\Application\UseCase\PurchaseUseCase;
use App\Http\Requests\AddressRequest;
use App\Http\Requests\PurchaseRequest;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function prePurchase($itemId, PurchaseUseCase $useCase, Request $req)
    {
        return response()->json(
            $useCase->prePurchase($req->user()->id, $itemId)
        );
    }

    public function updateAddress($itemId, AddressRequest $req, PurchaseUseCase $useCase)
    {
        return response()->json(
            $useCase->updateAddress(
                userId: $req->user()->id,
                itemId: $itemId,
                data: $req->validated()
            )
        );
    }

    public function checkout(PurchaseRequest $req, PurchaseUseCase $useCase)
    {
        return response()->json($useCase->checkout($req));
    }

    public function thanks(Request $req, PurchaseUseCase $useCase)
    {
        return response()->json($useCase->thanks($req));
    }
}

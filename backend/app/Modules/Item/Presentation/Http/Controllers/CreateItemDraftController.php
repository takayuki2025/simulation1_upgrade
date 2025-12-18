<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Modules\Item\Application\UseCase\Item\Command\CreateItemDraftUseCase;
use App\Modules\Item\Application\Dto\Item\CreateItemDraftInput;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class CreateItemDraftController extends Controller
{
    public function __construct(
        private CreateItemDraftUseCase $useCase,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'seller_id'      => ['required', 'string'],
            'name'           => ['required', 'string', 'max:255'],
            'price_amount'   => ['required', 'integer', 'min:0'],
            'price_currency' => ['required', 'string', 'size:3'],
            'brand'          => ['nullable', 'string'],
        ]);

        $principal = $request->attributes->get('auth_principal');

        if (! $principal instanceof AuthPrincipal) {
            abort(401, 'Authentication required');
        }

        $tenantId = $request->attributes->get('tenant_id');

        $input = new CreateItemDraftInput(
            sellerId: $validated['seller_id'],
            name: $validated['name'],
            priceAmount: $validated['price_amount'],
            priceCurrency: $validated['price_currency'],
            brandRaw: $validated['brand'] ?? null,
        );

        $output = $this->useCase->execute(
            $input,
            $principal,
            $tenantId
        );

        return response()->json([
            'draft_id' => $output->draftId,
            'status'   => $output->status,
            'editable' => $output->editable,
        ], 201);
    }
}
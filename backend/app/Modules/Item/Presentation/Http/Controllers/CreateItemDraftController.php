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
    ) {
    }


    public function __invoke(Request $request): JsonResponse
    {


        logger()->info('[CreateItemDraftController] raw request', [
            'seller_id' => $request->input('seller_id'),
            'explain'   => $request->input('explain'),
            'condition' => $request->input('condition'),
            'category'  => $request->input('category'),
            'category_type' => gettype($request->input('category')),
            'all' => $request->all(),
        ]);

        $validated = $request->validate([
            'seller_id'      => ['required', 'string'],
            'name'           => ['required', 'string', 'max:255'],
            'price_amount'   => ['required', 'integer', 'min:0'],
            'price_currency' => ['required', 'string', 'size:3'],
            'brand'          => ['nullable', 'string'],

            // ★ 追加
            'explain'        => ['nullable', 'string'],
            'condition'      => ['nullable', 'string'],
            'category'       => ['nullable', 'array'],
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

            // ★ Draft 用
            explain: $validated['explain'] ?? null,
            condition: $validated['condition'] ?? null,
            category: $validated['category'] ?? null,
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

<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Modules\Item\Application\UseCase\Item\Command\UploadItemDraftImageUseCase;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;

final class UploadItemDraftImageController extends Controller
{
    public function __construct(
        private UploadItemDraftImageUseCase $useCase
    ) {}

    public function __invoke(Request $request, string $draftId): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'],
        ]);

        $principal = $request->attributes->get('auth_principal');
        if (! $principal instanceof AuthPrincipal) {
            throw new \RuntimeException('AuthPrincipal not found');
        }

        $path = $this->useCase->execute(
            $draftId,
            $request->file('image'),
            $principal
        );

        return response()->json([
            'image_path' => $path,
        ], 200);
    }
}

<?php

namespace App\Modules\Item\Presentation\Http\Controllers;

use Illuminate\Http\Request;
use App\Modules\Item\Application\UseCase\Item\Command\UploadItemDraftImageUseCase;
use App\Modules\Item\Domain\ValueObject\ItemImagePath;
use App\Modules\Auth\Application\Service\AuthContext;

final class UploadItemDraftImageController
{
    public function __construct(
        private UploadItemDraftImageUseCase $useCase,
        private AuthContext $authContext,
    ) {
    }

    public function __invoke(Request $request, string $draftId)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'],
        ]);

        $principal = $this->authContext->principal();

        $path = ItemImagePath::fromUploadedFile(
            $request->file('image')
        );

        // ★ handle() を呼ぶ
        $this->useCase->handle(
            $draftId,
            $path,
            $principal
        );

        return response()->json(['status' => 'ok'], 201);
    }
}

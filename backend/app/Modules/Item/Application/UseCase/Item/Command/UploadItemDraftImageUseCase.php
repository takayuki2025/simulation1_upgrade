<?php

namespace App\Modules\Item\Application\UseCase\Item\Command;

use App\Modules\Item\Domain\Repository\ItemDraftRepository;
use App\Modules\Item\Domain\ValueObject\ItemImagePath;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use DomainException;

final class UploadItemDraftImageUseCase
{
    public function __construct(
        private ItemDraftRepository $drafts,
    ) {
    }

    public function handle(
        string $draftId,
        ItemImagePath $imagePath,
        AuthPrincipal $principal,
    ): void {
        $draft = $this->drafts->findById($draftId);

        if (! $draft) {
            throw new DomainException('Draft not found');
        }

        // ★ 正しい所有者チェック
        if (! $draft->sellerId()->belongsTo($principal)) {
            throw new DomainException('You do not own this draft');
        }

        $draft->attachImage($imagePath);

        $this->drafts->save($draft);
    }
}

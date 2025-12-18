<?php

namespace App\Modules\Item\Application\UseCase\Item\Command;

use App\Modules\Item\Domain\Repository\ItemDraftRepository;
use App\Modules\Item\Domain\ValueObject\ItemImagePath;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Illuminate\Http\UploadedFile;

final class UploadItemDraftImageUseCase
{
    public function __construct(
        private ItemDraftRepository $draftRepository,
    ) {}

    public function execute(
        string $draftId,
        UploadedFile $file,
        AuthPrincipal $principal,
    ): string {
        $draft = $this->draftRepository->findById($draftId);

        if (! $draft) {
            throw new \DomainException('Draft not found');
        }

        // 認可（本人のみ）
        if (! $draft->sellerId()->belongsTo($principal)) {
            throw new \DomainException('Forbidden');
        }

        // 保存
        $storedPath = $file->store('item-drafts', 'public');

        // ★ ValueObject に変換
        $imagePath = ItemImagePath::fromRaw($storedPath);
        $draft->attachImage($imagePath);

        $this->draftRepository->save($draft);

        return $imagePath->value();
    }
}
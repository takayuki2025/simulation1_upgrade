<?php

namespace App\Modules\User\Presentation\Application\UseCase;

use App\Modules\User\Presentation\Domain\Repository\MypageRepository; // MypageRepositoryはDomain Rootにいると仮定

class MypageUseCase
{
    public function __construct(
        private MypageRepository $mypages
    ) {
    }

    /**
     * 出品した商品一覧
     */
    public function listSellItems(int $userId): array
    {
        return $this->mypages->listSellItems($userId);
    }

    /**
     * 購入した商品一覧
     */
    public function listBoughtItems(int $userId): array
    {
        return $this->mypages->listBoughtItems($userId);
    }

    /**
     * 購入前の住所フォーム用データ取得
     */
    public function getAddressForm(int $userId, int $itemId): array
    {
        return $this->mypages->findAddressForm($userId, $itemId);
    }

    /**
     * 購入時の住所更新
     */
    public function updateAddress(
        int $userId,
        int $itemId,
        string $postNumber,
        string $address,
        ?string $building
    ): bool {
        return $this->mypages->updateAddress(
            $userId,
            $itemId,
            $postNumber,
            $address,
            $building
        );
    }
}

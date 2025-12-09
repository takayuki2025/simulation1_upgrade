<?php

namespace App\Application\UseCase\Mypage;

use App\Domain\Repository\MypageRepository;

class MypageUseCaseImpl implements MypageUseCase
{
    private MypageRepository $mypageRepository;

    public function __construct(MypageRepository $mypageRepository)
    {
        $this->mypageRepository = $mypageRepository;
    }

    public function getProfile(int $userId): array
    {
        return [
            'sell_items' => $this->mypageRepository->listSellItems($userId),
            'bought_items' => $this->mypageRepository->listBoughtItems($userId),
            'address_form' => $this->mypageRepository->findAddressForm($userId, 0),
        ];
    }
}

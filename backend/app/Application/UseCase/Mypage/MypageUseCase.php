<?php

namespace App\Application\UseCase\Mypage;

interface MypageUseCase
{
    public function getProfile(int $userId): array;
}

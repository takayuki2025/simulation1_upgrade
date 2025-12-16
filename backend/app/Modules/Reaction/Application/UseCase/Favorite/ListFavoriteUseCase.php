<?php

namespace App\Modules\Reaction\Application\UseCase\Favorite;


use App\Modules\Reaction\Domain\Repository\FavoriteRepository;
use App\Modules\Reaction\Domain\ValueObject\ReactorId;

final class ListFavoriteUseCase
{
    public function __construct(
        private FavoriteRepository $favoriteRepository,
    ) {
    }

    public function execute(int $userId): iterable
    {
        return $this->favoriteRepository->listItemsByUser(
            new ReactorId($userId)
        );
    }
}

<?php

namespace App\Modules\Reaction\Application\UseCase\Favorite;

use App\Modules\Reaction\Domain\Repository\FavoriteRepository;
use App\Modules\Reaction\Domain\ValueObject\ReactorId;

final class ListFavoriteUseCase
{
    public function __construct(private readonly FavoriteRepository $favorites)
    {
    }

    public function execute(int $userId): iterable
    {
        return $this->favorites->listItemsByUser(new ReactorId($userId));
    }
}

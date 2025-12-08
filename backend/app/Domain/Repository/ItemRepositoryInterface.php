<?php

namespace App\Domain\Repository;

// use App\Domain\Entity\Item;

use App\Models\Item;
use App\Models\Shop;


interface ItemRepositoryInterface
{
    public function listAll();
    public function find(int $id);
    public function uploadImage($request);
    public function create(array $data): Item;
    public function getByShop(Shop $shop): iterable;
    public function purchaseConfirm(int $id);
}

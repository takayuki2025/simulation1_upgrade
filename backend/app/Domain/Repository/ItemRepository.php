<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Item;


interface ItemRepository
{
    public function listAll();
    public function find(int $id);
    public function uploadImage($request);
    public function create(array $data);
    public function purchaseConfirm(int $id);
}

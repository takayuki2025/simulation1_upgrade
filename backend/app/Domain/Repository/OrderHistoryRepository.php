<?php

namespace App\Domain\Repository;

interface OrderHistoryRepository
{
    /**
     * 購入履歴保存
     *
     * @param array{
     *   user_id:int,
     *   item_id:int,
     *   status?:string,
     *   buy_address?:string,
     *   payment?:string
     * } $data
     */
    public function create(array $data): void;
}

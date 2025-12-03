<?php

namespace App\Infrastructure\Persistence;

use App\Domain\Repository\OrderHistoryRepository;
use App\Models\OrderHistory;
use Illuminate\Support\Facades\Log;

class EloquentOrderHistoryRepository implements OrderHistoryRepository
{
    public function create(array $data): void
    {
        OrderHistory::create([
            'user_id'     => $data['user_id'],
            'item_id'     => $data['item_id'],
            'status'      => $data['status']      ?? '購入済み',
            'buy_address' => $data['buy_address'] ?? '',
            'payment'     => $data['payment']     ?? '',
        ]);

        Log::info('OrderHistory saved', [
            'user_id' => $data['user_id'],
            'item_id' => $data['item_id']
        ]);
    }
}

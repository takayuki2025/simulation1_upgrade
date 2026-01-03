<?php

namespace App\Modules\Order\Application\UseCase;

use App\Modules\Order\Application\Dto\CreateOrderInput;
use App\Modules\Order\Application\Dto\CreateOrderOutput;
use App\Modules\Order\Application\Dto\OrderItemSnapshot;
use App\Modules\Order\Domain\Entity\Order;
use App\Modules\Order\Domain\Repository\OrderRepository;
use App\Modules\Order\Domain\Repository\OrderHistoryRepository;
use Illuminate\Support\Facades\DB;

final class CreateOrderUseCase
{
    public function __construct(
        private OrderRepository $orders,
        private OrderHistoryRepository $history,
    ) {
    }

    public function handle(CreateOrderInput $input): CreateOrderOutput
    {
        return DB::transaction(function () use ($input) {

            $snapshots = array_map(function (array $row) {
                return OrderItemSnapshot::fromArray([
                    'item_id'        => $row['item_id'],
                    'name'           => $row['name'],
                    'price_amount'   => $row['price_amount'],
                    'price_currency' => $row['price_currency'],
                    'condition'      => $row['condition'] ?? null,
                    'category'       => $row['category'] ?? [],
                    'image_path'     => $row['image_path'] ?? null,
                    'quantity'       => $row['quantity'] ?? 1,
                ]);
            }, $input->items);

            // totals (simple v1)
            $currency = $snapshots[0]->priceCurrency;
            $totalAmount = 0;
            foreach ($snapshots as $s) {
                if ($s->priceCurrency !== $currency) {
                    throw new \DomainException('Mixed currency is not supported in v1');
                }
                $totalAmount += ($s->priceAmount * $s->quantity);
            }

            $order = Order::create(
                shopId: $input->shopId,
                userId: $input->userId,
                totalAmount: $totalAmount,
                currency: $currency,
                items: $snapshots,
                meta: $input->meta
            );

            $saved = $this->orders->save($order);



            // =============================
            // ✅ order_items を作成（正規データ）
            // =============================
            foreach ($snapshots as $snapshot) {
                DB::table('order_items')->insert([
                    'order_id'       => $saved->id(),
                    'item_id'        => $snapshot->itemId,
                    'shop_id'        => $saved->shopId(),
                    'item_name'      => $snapshot->name,
                    'item_image'     => $snapshot->imagePath,
                    'price_amount'   => $snapshot->priceAmount,
                    'price_currency' => $snapshot->priceCurrency,
                    'quantity'       => $snapshot->quantity,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);
            }


            $this->history->addEvent(
                orderId: $saved->id() ?? 0,
                type: 'created',
                payload: [
                    'shop_id'      => $saved->shopId(),
                    'user_id'      => $saved->userId(),
                    'total_amount' => $saved->totalAmount(),
                    'currency'     => $saved->currency(),
                ]
            );

            return CreateOrderOutput::from(
                orderId: $saved->id() ?? 0,
                status: $saved->status(),
                totalAmount: $saved->totalAmount(),
                currency: $saved->currency()
            );
        });
    }
}

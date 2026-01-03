<?php

namespace App\Modules\Order\Infrastructure\EventListener;

use App\Modules\Order\Domain\Event\OrderPaid;
use App\Modules\Shipment\Application\UseCase\CreateShipmentDraftUseCase;
use App\Modules\Shipment\Application\Dto\CreateShipmentDraftInput;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

/**
 * OrderPaid を受けて Shipment Draft を作成する。
 *
 * - Event 駆動（Order -> Shipment）
 * - ShipmentContext 内で必要情報を再取得して Draft を作る
 * - 例外を握りつぶさず、ジョブとしてリトライ可能にする（推奨）
 */
final class OnOrderPaidCreateShipmentDraft
{
    // use InteractsWithQueue;

    // /**
    //  * リトライ・バックオフ（必要に応じて調整）
    //  */
    // public int $tries = 10;
    // public int $backoff = 10;

    // public function __construct(
    //     private CreateShipmentDraftUseCase $createShipmentDraft,
    // ) {
    // }

    // public function handle(OrderPaid $event): void
    // {
    //     // Event は薄いので、Shipment 側で orderId を起点に再取得する方針
    //     $input = new CreateShipmentDraftInput(
    //         orderId: $event->orderId,
    //         shopId: $event->shopId,
    //     );

    //     $this->createShipmentDraft->handle($input);
    // }
}

<?php

namespace App\Modules\Shipment\Infrastructure\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event; // 💡 必須：これを使って配線します
use App\Modules\Shipment\Domain\Repository\ShipmentRepository;
use App\Modules\Shipment\Domain\Repository\ShipmentEventRepository;
use App\Modules\Shipment\Infrastructure\Persistence\EloquentShipmentRepository;
use App\Modules\Shipment\Infrastructure\Persistence\EloquentShipmentEventRepository;
use App\Modules\Shipment\Domain\Service\EtaCalculator;
// 💡 イベントとリスナーをインポート
use App\Modules\Order\Domain\Event\OrderPaid;
use App\Modules\Shipment\Application\Listener\CreateShipmentOnOrderPaidListener;

final class ShipmentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Repositories
        $this->app->bind(
            ShipmentRepository::class,
            EloquentShipmentRepository::class
        );

        $this->app->bind(
            ShipmentEventRepository::class,
            EloquentShipmentEventRepository::class
        );

        // Domain Services
        $this->app->singleton(EtaCalculator::class);
    }

    public function boot(): void
    {
        // 💡 支払完了イベントを受け取ったら、出荷を作成するリスナーを起動する（Aでは使用しない）
        // Event::listen(
        //     OrderPaid::class,
        //     CreateShipmentOnOrderPaidListener::class
        // );
    }
}

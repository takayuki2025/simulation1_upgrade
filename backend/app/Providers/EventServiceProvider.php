<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Auth\Events\Verified;
use App\Modules\Order\Domain\Event\OrderPaid;
use App\Modules\Shipment\Application\Listener\CreateShipmentOnOrderPaidListener;

final class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        Verified::class => [
            \App\Listeners\RedirectAfterEmailVerified::class,
        ],

        // ★★★ これが最重要 ★★★
        OrderPaid::class => [
            CreateShipmentOnOrderPaidListener::class,
        ],
    ];



    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}

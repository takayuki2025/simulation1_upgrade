<?php

namespace App\Modules\Shop;

use Illuminate\Support\ServiceProvider;
use App\Modules\Shop\Domain\Repository\ShopRepository;
use App\Modules\Shop\Infrastructure\Persistence\EloquentShopRepository;

final class ShopServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            ShopRepository::class,
            EloquentShopRepository::class
        );
    }
}

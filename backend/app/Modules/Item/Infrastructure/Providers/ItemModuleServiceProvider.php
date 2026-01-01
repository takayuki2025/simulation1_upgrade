<?php

namespace App\Modules\Item\Infrastructure\Providers;

use Illuminate\Support\ServiceProvider;
// Domain Repositories
use App\Modules\Item\Domain\Repository\ItemRepository;
use App\Modules\Item\Domain\Repository\ItemDraftRepository;
// Repository Implementations
use App\Modules\Item\Infrastructure\Persistence\Repository\EloquentItemRepository;
use App\Modules\Item\Infrastructure\Persistence\Repository\EloquentItemDraftRepository;
// Brand Normalization
use App\Modules\Item\Domain\Port\BrandNormalizationPort;
use App\Modules\Item\Infrastructure\External\AtlaskernelBrandNormalizer;
use Illuminate\Support\Facades\Event;

final class ItemModuleServiceProvider extends ServiceProvider
{

    protected $listen = [
        \App\Modules\Item\Domain\Event\ItemPublished::class => [
            \App\Modules\Item\Application\Listener\GenerateItemEntitiesOnItemPublished::class,
        ],
    ];

    public function register(): void
    {
        // Repository bindings
        $this->app->bind(
            ItemRepository::class,
            EloquentItemRepository::class
        );

        $this->app->bind(
            ItemDraftRepository::class,
            EloquentItemDraftRepository::class
        );

        // Brand normalization (同期版)
        $this->app->bind(
            BrandNormalizationPort::class,
            AtlaskernelBrandNormalizer::class
        );
    }

    public function boot(): void
    {
        // イベント登録を有効化
        foreach ($this->listen as $event => $listeners) {
            foreach ($listeners as $listener) {
                Event::listen($event, $listener);
            }
        }
    }
}

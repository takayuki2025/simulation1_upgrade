<?php

namespace App\Modules\Item\Infrastructure\Providers;

use Illuminate\Support\ServiceProvider;
use App\Modules\Item\Application\Port\ItemAnalysisPort;
use App\Modules\Item\Infrastructure\Port\QueueItemAnalysisAdapter;

class ItemModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ItemAnalysisPort::class, QueueItemAnalysisAdapter::class);
    }
}

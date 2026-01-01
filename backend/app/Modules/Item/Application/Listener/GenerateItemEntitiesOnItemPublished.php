<?php

namespace App\Modules\Item\Application\Listener;

use App\Modules\Item\Domain\Event\ItemPublished;
use App\Modules\Item\Domain\Service\AtlasKernelService;

final class GenerateItemEntitiesOnItemPublished
{
    public function __construct(
        private AtlasKernelService $atlasKernel,
    ) {
    }

    public function handle(ItemPublished $event): void
    {
        $this->atlasKernel->analyze(
            $event->itemId,
            $event->rawText,
            $event->tenantId,
        );
    }
}

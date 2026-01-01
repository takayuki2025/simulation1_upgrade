<?php

namespace App\Modules\Item\Domain\Event;

use App\Modules\Item\Domain\ValueObject\ItemId;

final class ItemPublished
{
    public function __construct(
        public readonly ItemId $itemId,
    ) {
    }
}

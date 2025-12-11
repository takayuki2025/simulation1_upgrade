<?php

namespace App\Modules\Item\Presentation\Domain\ValueObject;

class ItemImagePath
{
    public function __construct(
        private string $path
    ) {
    }

    public function getPath(): string
    {
        return $this->path;
    }
}

<?php

namespace App\Modules\Item\Domain\ValueObject;

final class ItemImagePath
{
    private function __construct(
        private string $path
    ) {
        // ★ 念のため / を除去
        $this->path = ltrim($this->path, '/');
    }

    public static function fromRaw(?string $raw): ?self
    {
        if (!$raw) {
            return null;
        }

        $path = preg_replace('#^/?storage/#', '', $raw);
        $path = ltrim($path, '/');

        return new self($path);
    }

    public static function fromInternal(string $path): self
    {
        // ★ ここが重要：internal でも必ず正規化
        $path = preg_replace('#^/?storage/#', '', $path);
        $path = ltrim($path, '/');

        return new self($path);
    }

    public function value(): string
    {
        return $this->path;
    }
}

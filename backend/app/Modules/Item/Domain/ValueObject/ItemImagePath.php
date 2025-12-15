<?php



namespace App\Modules\Item\Domain\ValueObject;


final class ItemImagePath
{
    private string $path;

    private function __construct(string $path)
    {
        $this->path = $path;
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

    public function value(): string
    {
        return $this->path;
    }
}



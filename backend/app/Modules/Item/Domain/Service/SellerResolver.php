<?php

namespace App\Modules\Item\Domain\Service;

use App\Modules\Item\Domain\ValueObject\SellerId;
use App\Modules\Item\Domain\ValueObject\SellerType;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Illuminate\Support\Facades\DB;

final class SellerResolver
{
    public function resolve(
        string $sellerRaw,
        AuthPrincipal $principal,
        ?int $tenantId = null,
    ): SellerId {
        [$type, $id] = $this->parse($sellerRaw);

        return match ($type) {
            SellerType::INDIVIDUAL => $this->resolveIndividual($id, $principal),
            SellerType::SHOP       => $this->resolveShop($id, $principal, $tenantId),
        };
    }

    private function parse(string $raw): array
    {
        if (! str_contains($raw, ':')) {
            throw new \InvalidArgumentException('Invalid seller_id format.');
        }

        [$type, $id] = explode(':', $raw, 2);

        return [SellerType::from($type), (int) $id];
    }

    private function resolveIndividual(
        int $userId,
        AuthPrincipal $principal,
    ): SellerId {
        if ((int) $principal->providerUid !== $userId) {
            throw new \DomainException('Cannot sell as another user.');
        }

        return SellerId::user($userId);
    }

    private function resolveShop(
        int $shopId,
        AuthPrincipal $principal,
        ?int $tenantId,
    ): SellerId {
        if ($tenantId !== null && $tenantId !== $shopId) {
            throw new \DomainException('Tenant mismatch.');
        }

        $hasRole = DB::table('role_user')
            ->where('user_id', (int) $principal->providerUid)
            ->where('shop_id', $shopId)
            ->exists();

        if (! $hasRole) {
            throw new \DomainException('No permission for this shop.');
        }

        return SellerId::shop($shopId);
    }
}

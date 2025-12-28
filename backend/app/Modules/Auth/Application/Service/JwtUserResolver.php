<?php

namespace App\Modules\Auth\Application\Service;

use App\Auth\UserResolver;
use App\Models\User;
use App\Modules\Auth\Domain\Port\TokenVerifierPort;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Illuminate\Http\Request;

final class JwtUserResolver implements UserResolver
{
    public function __construct(
        private TokenVerifierPort $verifier
    ) {
    }

    public function resolve(Request $request): ?User
    {
        $token = $request->bearerToken();
        if (!$token) {
            return null;
        }

        try {
            $decoded = $this->verifier->decode($token);
        } catch (\Throwable) {
            return null;
        }

        if (
            property_exists($decoded, 'exp') &&
            time() >= (int) $decoded->exp
        ) {
            return null;
        }

        $userId = (int) ($decoded->sub ?? 0);
        if ($userId <= 0) {
            return null;
        }

        return User::find($userId);
    }

    /**
     * 🔹 DDD用途（Optional）
     */
    public function resolvePrincipal(Request $request): ?AuthPrincipal
    {
        $token = $request->bearerToken();
        if (!$token) {
            return null;
        }

        $decoded = $this->verifier->decode($token);

        $user = User::find((int) $decoded->sub);
        if (!$user) {
            return null;
        }

        return new AuthPrincipal(
            provider: 'jwt',
            providerUid: (string) $decoded->sub,
            userId: $user->id,
            email: $user->email,
            emailVerified: (bool) $user->email_verified_at,
            displayName: $user->name,
            shopIds: $user->shops()->pluck('shops.id')->all(),
        );
    }
}

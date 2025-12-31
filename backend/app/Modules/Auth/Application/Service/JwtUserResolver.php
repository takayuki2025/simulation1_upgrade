<?php

namespace App\Modules\Auth\Application\Service;

use App\Models\User;
use App\Modules\Auth\Domain\Port\TokenVerifierPort;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Illuminate\Http\Request;

final class JwtUserResolver
{
    public function __construct(
        private TokenVerifierPort $verifier
    ) {
    }

    /**
     * @return array{user: User, principal: AuthPrincipal}|null
     */
    public function resolve(Request $request): ?array
    {
        $token = $request->bearerToken();
        if (! $token) {
            return null;
        }

        try {
            $decoded = $this->verifier->decode($token);
        } catch (\Throwable) {
            return null;
        }

        if (isset($decoded->exp) && time() >= (int) $decoded->exp) {
            return null;
        }

        $userId = (int) ($decoded->sub ?? 0);
        if ($userId <= 0) {
            return null;
        }

        $user = User::find($userId);
        if (! $user) {
            return null;
        }

        $principal = AuthPrincipal::fromJwt(
            userId: $user->id,
            providerUid: (string) $decoded->sub,
            email: $user->email,
            emailVerified: true,
            displayName: $user->name,
            shopIds: is_array($decoded->shop_ids ?? null)
                ? $decoded->shop_ids
                : [],
        );

        return [
            'user' => $user,
            'principal' => $principal,
        ];
    }
}

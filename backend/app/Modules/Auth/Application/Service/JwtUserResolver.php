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

        // exp チェック
        if (isset($decoded->exp) && time() >= (int) $decoded->exp) {
            return null;
        }

        // JWT sub = 内部 user_id 前提
        $userId = (int) ($decoded->sub ?? 0);
        if ($userId <= 0) {
            return null;
        }

        $user = User::find($userId);
        if (! $user) {
            return null;
        }

        /**
         * ✅ AuthPrincipal は factory 経由で生成
         * - providerUid = JWT sub（firebase_uid ではない）
         * - shopIds = JWT claim（無ければ空配列）
         */
        $principal = AuthPrincipal::fromJwt(
            userId: $user->id,
            providerUid: (string) $decoded->sub,
            email: $user->email,
            emailVerified: true, // JWT 発行時点で保証されている前提
            displayName: $user->name,
            shopIds: is_array($decoded->shop_ids ?? null)
                ? $decoded->shop_ids
                : [],
        );

        return [
            'user'      => $user,
            'principal' => $principal,
        ];
    }
}

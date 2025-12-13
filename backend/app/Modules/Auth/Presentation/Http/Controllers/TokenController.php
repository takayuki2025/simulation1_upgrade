<?php

namespace App\Modules\Auth\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Domain\Service\RefreshTokenService;
use App\Modules\Auth\Domain\Service\TokenIssuerService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TokenController extends Controller
{
    public function __construct(
        private RefreshTokenService $refreshTokens,
        private TokenIssuerService $tokenIssuer
    ) {
    }

    public function refresh(Request $request): JsonResponse
    {
        $rawRefreshToken = $request->input('refresh_token');
        $deviceId        = $request->input('device_id');   // 任意
        $deviceName      = $request->input('device_name'); // 任意

        if (! $rawRefreshToken) {
            return response()->json([
                'message' => 'refresh_token is required'
            ], 422);
        }

        $refresh = $this->refreshTokens->validate($rawRefreshToken);

        if (! $refresh) {
            // ★ 不正 or 期限切れのログ
            Log::warning(json_encode([
                'event'      => 'refresh_token_invalid',
                'service'    => 'laravel-auth',
                'ip'         => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]));

            return response()->json([
                'message' => 'Invalid or expired refresh token'
            ], 401);
        }

        $user = $refresh->user;

        // ★ Rotation: 新しい RefreshToken 発行
        $newRawRefreshToken = $this->refreshTokens->rotate(
            $refresh,
            $request->ip(),
            $request->userAgent(),
            $deviceId,
            $deviceName,
        );

        $newAccessToken = $this->tokenIssuer->issue($user);

        // ★ 発行成功ログ（JSON）
        Log::info(json_encode([
            'event'       => 'refresh_token_issued',
            'service'     => 'laravel-auth',
            'user_id'     => $user->id,
            'tenant_id'   => $user->shop_id,
            'device_id'   => $deviceId ?? $refresh->device_id,
            'device_name' => $deviceName ?? $refresh->device_name,
            'ip'          => $request->ip(),
        ]));

        return response()->json([
            'access_token'  => $newAccessToken,
            'refresh_token' => $newRawRefreshToken,
            'token_type'    => 'Bearer',
            'expires_in'    => config('jwt.ttl', 3600),
        ]);
    }
}

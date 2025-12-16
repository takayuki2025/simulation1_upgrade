<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class OptionalJwtAuth
{
    public function handle(Request $request, Closure $next)
    {
        \Log::info('[OptionalJwtAuth] start', [
            'has_token' => (bool) $request->bearerToken(),
        ]);

        if (!$request->bearerToken()) {
            return $next($request);
        }

        try {
            // ★ JwtAuthenticate と同じロジックを直接呼ぶ
            $user = app(\App\Http\Middleware\JwtAuthenticate::class)
                ->resolveUserFromRequest($request);

            \Log::info('[OptionalJwtAuth] resolved user', [
                'user_id' => $user?->id,
            ]);

            if ($user) {
                Auth::setUser($user);
                $request->setUserResolver(fn () => $user);
            }
        } catch (\Throwable $e) {
            \Log::warning('[OptionalJwtAuth] exception', [
                'msg' => $e->getMessage(),
            ]);
        }

        return $next($request);
    }
}

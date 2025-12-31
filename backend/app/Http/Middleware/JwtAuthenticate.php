<?php

namespace App\Http\Middleware;

use App\Modules\Auth\Application\Service\JwtUserResolver;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class JwtAuthenticate
{
    public function __construct(
        private JwtUserResolver $resolver
    ) {
    }

    public function handle(Request $request, Closure $next)
    {
        $resolved = $this->resolver->resolve($request);

        if (! $resolved) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user = $resolved['user'];
        $principal = $resolved['principal'];

        // Laravel 互換（既存コード保護）
        Auth::setUser($user);
        $request->setUserResolver(fn () => $user);

        // DDD 正
        $request->attributes->set('auth_principal', $principal);

        return $next($request);
    }
}

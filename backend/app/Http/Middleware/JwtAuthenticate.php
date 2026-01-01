<?php

namespace App\Http\Middleware;

use App\Modules\Auth\Application\Service\JwtUserResolver;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Modules\Auth\Application\Service\AuthContext;


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

        // Laravel 互換
        Auth::setUser($user);
        $request->setUserResolver(fn () => $user);

        // ✅ Request に載せるだけ
        $request->attributes->set('auth_principal', $principal);

        return $next($request);
    }
}

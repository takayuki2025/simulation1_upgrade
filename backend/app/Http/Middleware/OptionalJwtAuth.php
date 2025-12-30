<?php

namespace App\Http\Middleware;

use App\Modules\Auth\Application\Service\JwtUserResolver;
use Closure;
use Illuminate\Http\Request;

final class OptionalJwtAuth
{
    public function __construct(
        private JwtUserResolver $resolver
    ) {
    }

    public function handle(Request $request, Closure $next)
    {
        if (! $request->hasHeader('Authorization')) {
            return $next($request);
        }

        $resolved = $this->resolver->resolve($request);

        if ($resolved) {
            // 🔑 JwtAuthenticate と完全に同じ契約
            $request->attributes->set('auth_principal', $resolved['principal']);
            $request->attributes->set('jwt_user', $resolved['user']);
        }

        return $next($request);
    }
}

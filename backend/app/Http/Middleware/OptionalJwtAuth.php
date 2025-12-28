<?php

namespace App\Http\Middleware;

use App\Modules\Auth\Application\Service\JwtUserResolver;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class OptionalJwtAuth
{
    public function __construct(
        private JwtUserResolver $resolver
    ) {
    }

    public function handle(Request $request, Closure $next)
    {
        $resolved = $this->resolver->resolve($request);

        if ($resolved) {
            Auth::setUser($resolved['user']);
            $request->setUserResolver(fn () => $resolved['user']);

            $request->attributes->set('auth_principal', $resolved['principal']);
            $request->attributes->set('tenant_id', $resolved['tenant_id']);
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use App\Modules\Auth\Application\Service\JwtUserResolver;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

final class OptionalJwtAuth
{
    public function __construct(
        private JwtUserResolver $resolver
    ) {
    }

    public function handle(Request $request, Closure $next)
    {
        $request->attributes->set('auth_principal', null);

        if (! $request->hasHeader('Authorization')) {
            return $next($request);
        }

        try {
            $resolved = $this->resolver->resolve($request);

            if ($resolved) {
                $user = $resolved['user'];
                $principal = $resolved['principal'];

                Auth::setUser($user);
                $request->setUserResolver(fn () => $user);
                $request->attributes->set('auth_principal', $principal);
            }
        } catch (Throwable) {
            // optional: ignore
        }

        return $next($request);
    }
}

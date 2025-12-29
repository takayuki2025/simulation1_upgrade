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
        // Authorization が無ければ何もしない
        if (! $request->hasHeader('Authorization')) {
            return $next($request);
        }

        $user = $this->resolver->resolve($request);

        // ★ Auth::setUser は絶対に呼ばない
        if ($user) {
            // Request attribute にだけ載せる
            $request->attributes->set('jwt_user', $user);
        }

        return $next($request);
    }
}

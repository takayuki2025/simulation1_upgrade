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
        // 初期化
        $request->attributes->set('auth_principal', null);

        if ($request->hasHeader('Authorization')) {
            $resolved = $this->resolver->resolve($request);

            if ($resolved) {
                Auth::setUser($resolved['user']);
                $request->setUserResolver(fn () => $resolved['user']);

                // ★ ここが唯一の責務
                $request->attributes->set(
                    'auth_principal',
                    $resolved['principal']
                );
            }
        }

        return $next($request);
    }
}

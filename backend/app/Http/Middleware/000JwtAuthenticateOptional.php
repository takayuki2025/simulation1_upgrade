<?php

namespace App\Http\Middleware;

use App\Modules\Auth\Application\Service\JwtUserResolver;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class JwtAuthenticateOptional
{
    public function __construct(
        private JwtUserResolver $resolver
    ) {
    }

    public function handle(Request $request, Closure $next)
    {
        \Log::info('[JwtAuthenticateOptional] called', [
            'has_authorization' => $request->hasHeader('Authorization'),
        ]);

        $resolved = $this->resolver->resolve($request);

        // 🔑 未ログインでも通す
        if (! $resolved) {
            return $next($request);
        }

        /**
         * [
         *   'user' => User,
         *   'principal' => AuthPrincipal
         * ]
         */
        $user = $resolved['user'];
        $principal = $resolved['principal'];

        // Laravel 標準
        Auth::setUser($user);
        $request->setUserResolver(fn () => $user);

        // ★ ここが最重要（あなたの設計の核）
        $request->attributes->set('auth_principal', $principal);

        return $next($request);
    }
}

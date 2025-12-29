<?php

namespace App\Http\Middleware;

use App\Modules\Auth\Application\Service\JwtUserResolver;
use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
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
        \Log::info('[JwtAuthenticate] called', [
            'has_authorization' => $request->hasHeader('Authorization'),
            'auth_header'       => $request->header('Authorization'),
        ]);

        $resolved = $this->resolver->resolve($request);

        if (! $resolved) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        /**
         * resolver は以下を返す前提：
         * [
         *   'user' => User,
         *   'principal' => AuthPrincipal
         * ]
         */
        $user = $resolved['user'];
        $principal = $resolved['principal'];

        Auth::setUser($user);
        $request->setUserResolver(fn () => $user);

        // ★ DDD 用（これが無かった）
        $request->attributes->set('auth_principal', $principal);

        return $next($request);
    }
}

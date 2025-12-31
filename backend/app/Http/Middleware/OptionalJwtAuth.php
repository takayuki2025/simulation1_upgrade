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
        // ✅ 必ず初期化（ゲストのときの契約を固定）
        $request->attributes->set('auth_principal', null);
        $request->attributes->set('jwt_user', null);

        // Authorization ヘッダが無ければゲスト
        if (! $request->hasHeader('Authorization')) {
            return $next($request);
        }

        try {
            $resolved = $this->resolver->resolve($request);

            if ($resolved) {
                $user = $resolved['user'];
                $principal = $resolved['principal'];

                // ✅ JwtAuthenticate と同じ互換契約に揃える
                Auth::setUser($user);
                $request->setUserResolver(fn () => $user);

                // ✅ DDD 用 Principal（唯一の正）
                $request->attributes->set('auth_principal', $principal);

                // （任意：デバッグ/互換用）
                $request->attributes->set('jwt_user', $user);
            }
        } catch (Throwable $e) {
            // optional なので例外は握りつぶす（ログは任意）
            \Log::warning('[OptionalJwtAuth] invalid token', [
                'error' => $e->getMessage(),
            ]);
        }

        return $next($request);
    }
}

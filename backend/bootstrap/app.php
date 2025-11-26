<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\VerifyFirebaseToken;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Contracts\Container\BindingResolutionException;

return Application::configure(basePath: dirname(__DIR__))

    // ★★★ 修正箇所: withProvidersを追加し、AuthServiceProviderをロードする ★★★
    ->withProviders([
        // アプリケーション固有のプロバイダ
        App\Providers\AppServiceProvider::class,
        // Kreait\Laravel\Firebase\ServiceProvider::class は config/app.php に登録されているため削除
        App\Providers\AuthServiceProvider::class,
    ])

    ->withMiddleware(function (Middleware $middleware) {

        // --- Trust Proxies の設定 (Docker環境向け) ---
    // 🚨 【修正箇所1】Caddyからのリクエストを全て信頼
    $middleware->trustProxies(
    at: explode(',', env('TRUSTED_PROXIES', '10.0.0.0/8,172.16.0.0/12,192.168.0.0/16')),
    // ★★★ 修正: 確実に存在する定数を全て指定する ★★★
    headers: Request::HEADER_X_FORWARDED_FOR |
                Request::HEADER_X_FORWARDED_HOST |
                Request::HEADER_X_FORWARDED_PORT |
                Request::HEADER_X_FORWARDED_PROTO |
                Request::HEADER_X_FORWARDED_AWS_ELB |
                Request::HEADER_FORWARDED
    );

        // --- CSRF検証からAPIルートを除外 ---
        $middleware->validateCsrfTokens(except: [
            'api/*'
        ]);

        // ★★★ 暫定対処: 古い名前空間のミドルウェアをLaravel 11のクラスに強制的にマッピング ★★★
        $middleware->alias([
            'App\Http\Middleware\EncryptCookies' => \Illuminate\Cookie\Middleware\EncryptCookies::class,
            'App\Http\Middleware\AddQueuedCookiesToResponse' => \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            'App\Http\Middleware\StartSession' => \Illuminate\Session\Middleware\StartSession::class,
            'App\Http\Middleware\AuthenticateSession' => \Illuminate\Session\Middleware\AuthenticateSession::class,

            // ★★★ 修正箇所: ここに firebase.verify のエイリアスを移動/追加し、確実に認識させる ★★★
            'firebase.verify' => VerifyFirebaseToken::class,
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            'sanctum.auth' => \Laravel\Sanctum\Http\Middleware\Authenticate::class,
            'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        ]);
        // ★★★ 修正箇所ここまで ★★★


        // --- 1. グループミドルウェアの定義 ---
        $middleware->web(append: [
            // webグループに追加したいカスタムミドルウェアがあればここに記述
        ]);

        // --- APIミドルウェアグループの定義 ---
        $middleware->api(
            prepend: [
                // \Illuminate\Http\Middleware\HandleCors::class, // ★★★ 修正: Nginxに処理を一本化するため、Laravel側のCORSミドルウェアを削除 ★★★
            ],
            // 最後にルーティングバインディングを追加
            append: [
                'throttle:api',
                // ★★★ 修正箇所: VerifyFirebaseTokenをAPIグループ全体に適用 ★★★
                VerifyFirebaseToken::class,
                \Illuminate\Routing\Middleware\SubstituteBindings::class,
            ]
        );


    })
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withExceptions(function (Exceptions $exceptions) {

        // --- 例外処理: APIリクエスト時にJSON応答を返す ---
        $exceptions->render(function (\Throwable $e, Request $request) {

            // APIリクエストでない場合はLaravelのデフォルト処理に委ねる
            if (!($request->expectsJson() || $request->is('api/*'))) {
                return null;
            }

            // AuthenticationException (認証エラー 401) の処理
            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'error_type' => 'AuthenticationException',
                    'message' => 'Unauthenticated.',
                ], Response::HTTP_UNAUTHORIZED);
            }

            // BindingResolutionException（クラス見つからない系エラー 500）の処理
            if ($e instanceof BindingResolutionException) {
                return response()->json([
                    'error_type' => 'BindingResolutionException',
                    'message' => 'Service binding error: ' . $e->getMessage(),
                    'line' => $e->getLine(),
                    'file' => basename($e->getFile()),
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            // その他の例外
            $statusCode = 500;

            // HTTP例外（404 Not Foundなど）を適切に処理
            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
                $statusCode = $e->getStatusCode();
            }

            return response()->json([
                'error_type' => get_class($e),
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile()),
            ], $statusCode);
        });

    })
    ->create();
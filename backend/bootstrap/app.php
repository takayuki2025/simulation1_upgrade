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
    ->withMiddleware(function (Middleware $middleware) {

        // --- Trust Proxies の設定 (Docker環境向け) ---
        $middleware->trustProxies(at: [
            '**' 
        ]);

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
        ]);
        // ★★★ 修正箇所ここまで ★★★


        // --- 1. グループミドルウェアの定義 ---
        $middleware->web(append: [
            // webグループに追加したいカスタムミドルウェアがあればここに記述
        ]);

        // --- APIミドルウェアグループの定義 ---
        $middleware->api(
            // ★★★ 修正箇所: ここでCorsMiddlewareを手動で追加すると重複するため削除する ★★★
            prepend: [
                // \App\Http\Middleware\CorsMiddleware::class, // <-- これを削除！
                \Illuminate\Http\Middleware\HandleCors::class,
                \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            ],
            // 最後にルーティングバインディングを追加
            append: [
                \Illuminate\Routing\Middleware\SubstituteBindings::class,
            ]
        );
        // ★★★ 修正箇所ここまで ★★★
        
        // --- 2. ルートミドルウェアエイリアスの定義 (カスタムと認証のみ) ---
        $middleware->alias([
            'firebase.verify' => VerifyFirebaseToken::class, 
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class, 
            'sanctum.auth' => \Laravel\Sanctum\Http\Middleware\Authenticate::class, 
            'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        ]);
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

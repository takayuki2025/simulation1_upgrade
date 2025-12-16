<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\VerifyFirebaseToken;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Contracts\Container\BindingResolutionException;
// ★★★ 追加: カスタムミドルウェアをインポート (api/auth/check ルートの未認証→４０１（今回は正常）→２０１にする。No401Redirectで使用したものと同じ) ★★★
use App\Http\Middleware\No401Redirect;

return Application::configure(basePath: dirname(__DIR__))

    // ★★★ 修正箇所: withProvidersを追加し、AuthServiceProviderをロードする ★★★
    ->withProviders([
        // アプリケーション固有のプロバイダ
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
    ])

    ->withMiddleware(function (Middleware $middleware) {


        $middleware->append(\App\Http\Middleware\RequestLogMiddleware::class);

        $middleware->append(\App\Http\Middleware\AddTenantInfoToLogs::class);


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

        // ★★★ 修正箇所: ミドルウェアのエイリアス定義を整理 ★★★
        $middleware->alias([
            // Laravel 11の推奨クラスにマッピング
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            'sanctum.auth' => \Laravel\Sanctum\Http\Middleware\Authenticate::class,
            'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,

            // Firebaseカスタムミドルウェアのエイリアス（auth:firebaseで使用）
            // 'firebase.verify' => VerifyFirebaseToken::class,
            // 既存の古い名前空間のミドルウェアのエイリアスはLaravel 11では不要なため、削除
            // ⭐ ここに 'tenant' ミドルウェアのエイリアスを追加 ⭐
            'tenant' => \App\Http\Middleware\SetCurrentShop::class,
            'auth.jwt'   => \App\Http\Middleware\JwtAuthenticate::class,
            'auth.jwt.optional' => \App\Http\Middleware\OptionalJwtAuth::class,
            'role'       => \App\Http\Middleware\RoleMiddleware::class,
            'shop.role'  => \App\Http\Middleware\ShopScopedRoleMiddleware::class,
        ]);
        // ★★★ 修正箇所ここまで ★★★


        // --- 1. グループミドルウェアの定義 ---
        $middleware->web(append: [
            // webグループに追加したいカスタムミドルウェアがあればここに記述
        ]);

        // --- APIミドルウェアグループの定義 ---
        $middleware->api(
            // NginxでCORSを処理するため、HandleCorsは削除した状態を維持
            prepend: [
                // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
                \Illuminate\Routing\Middleware\SubstituteBindings::class, // これを先頭に
            ],
            // 最後にルーティングバインディングを追加
            append: [
                'throttle:api',
                // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
                // \Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
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

            // ★★★ 修正箇所: AuthenticationException (例外、認証エラー ８０１（４０１）の時だけ) の処理をカスタムレスポンスに置き換える ★★★
            if ($e instanceof AuthenticationException) {

                // 💡 401 を回避し、代わりに 200 OK とカスタムJSONを返す
                return response()->json([
                    'error_type' => 'AuthenticationException',
                    'message' => 'Unauthenticated or Token Expired. Please refresh token.',
                    // 💡 401相当であることをフロントエンドに伝えるカスタムステータスコード
                    'status_code_override' => No401Redirect::UNAUTHENTICATED_CODE, // 801
                    'authenticated' => false,
                ], Response::HTTP_OK); // ★★★ ここを 200 OK に変更 ★★★
            }
            // ★★★ 修正箇所ここまで ★★★

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

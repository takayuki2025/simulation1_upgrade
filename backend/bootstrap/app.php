<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Contracts\Container\BindingResolutionException;
use App\Http\Middleware\No401Redirect;

return Application::configure(basePath: dirname(__DIR__))

    ->withProviders([
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        App\Modules\Shipment\Infrastructure\Providers\ShipmentServiceProvider::class,
    ])

    ->withMiddleware(function (Middleware $middleware) {

        $middleware->append(\App\Http\Middleware\RequestLogMiddleware::class);
        $middleware->append(\App\Http\Middleware\AddTenantInfoToLogs::class);

        $middleware->trustProxies(
            at: explode(',', env('TRUSTED_PROXIES', '10.0.0.0/8,172.16.0.0/12,192.168.0.0/16')),
            headers: Request::HEADER_X_FORWARDED_FOR |
                Request::HEADER_X_FORWARDED_HOST |
                Request::HEADER_X_FORWARDED_PORT |
                Request::HEADER_X_FORWARDED_PROTO |
                Request::HEADER_X_FORWARDED_AWS_ELB |
                Request::HEADER_FORWARDED
        );

        $middleware->validateCsrfTokens(except: [
            'api/*'
        ]);

        $middleware->alias([
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            'sanctum.auth' => \Laravel\Sanctum\Http\Middleware\Authenticate::class,
            'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,

            'tenant' => \App\Http\Middleware\ResolveTenant::class,

            'auth.jwt'   => \App\Http\Middleware\JwtAuthenticate::class,
            'auth.jwt.optional' => \App\Http\Middleware\OptionalJwtAuth::class,
            'role'       => \App\Http\Middleware\RoleMiddleware::class,
            'shop.role'  => \App\Http\Middleware\ShopScopedRoleMiddleware::class,
        ]);

        $middleware->web(append: []);

        $middleware->api(
            prepend: [
                \Illuminate\Routing\Middleware\SubstituteBindings::class,
            ],
            append: [
                'throttle:api',
            ]
        );
    })

    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )

    ->withExceptions(function (Exceptions $exceptions) {

        $exceptions->render(function (\Throwable $e, Request $request) {

            if (!($request->expectsJson() || $request->is('api/*'))) {
                return null;
            }

            // ① AuthenticationException（あなたの既存仕様）
            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'error_type' => 'AuthenticationException',
                    'message' => 'Unauthenticated or Token Expired. Please refresh token.',
                    'status_code_override' => No401Redirect::UNAUTHENTICATED_CODE, // 801
                    'authenticated' => false,
                ], Response::HTTP_OK);
            }

            // ② ★追加：DomainException は 422 に落とす（今回の本命）
            if ($e instanceof \DomainException) {
                return response()->json([
                    'error_type' => 'DomainException',
                    'message' => $e->getMessage(),
                ], 422);
            }

            // ③ BindingResolutionException（あなたの既存仕様）
            if ($e instanceof BindingResolutionException) {
                return response()->json([
                    'error_type' => 'BindingResolutionException',
                    'message' => 'Service binding error: ' . $e->getMessage(),
                    'line' => $e->getLine(),
                    'file' => basename($e->getFile()),
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            // ④ その他
            $statusCode = 500;

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

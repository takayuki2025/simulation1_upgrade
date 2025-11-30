<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // 'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'user', 'register', 'firebase/*','mypage/*',],
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    // ★★★ 【重要修正】フロントエンドのホスト名とポートを明示的に許可 ★★★
    'allowed_origins' => [
        // 環境変数から取得（ここで FRONTEND_URL=http://localhost:3000 とするのが理想）
        env('FRONTEND_URL', 'https://localhost:3000'),
        // 念のため明示的に追記
        'http://127.0.0.1:3000',
        'https://laravel.test',
        'https://laravel.test:4431',
        'https://laravel.test:4430', // CaddyがHTTPSの場合に備えて
    ],
    // 環境変数にFRONTEND_URLが設定されていない場合（.envファイル）、
    // デフォルトで 'http://localhost' のみ許可するようにします。


    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // ★★★ Sanctum認証でCookieを使用するために必須 ★★★
    'supports_credentials' => true,

];
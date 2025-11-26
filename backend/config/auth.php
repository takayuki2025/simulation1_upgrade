<?php

return [
    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        // ★★★ ここに Firebase 認証ガードを追加 ★★★
        'firebase' => [
            'driver' => 'firebase', // kreait/laravel-firebase パッケージが提供するドライバー名
            'provider' => 'users', // ユーザー情報を取得するプロバイダ (通常は users でOK)
        ],

        'sanctum' => [
            'driver' => 'sanctum',
            'provider' => 'users',
            'hash' => false,
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class, // あなたのUserモデルのパス
        ],
    ],

    // ... (パスワード設定などは省略またはデフォルトでOK)
];
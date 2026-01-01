<?php


return [

    'defaults' => [
        'guard' => 'web', // ★ testing と相性が良い
        'passwords' => 'users',
    ],

    'guards' => [

        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        // ★ テスト用 jwt guard（session）
        'jwt' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],

    'jwt_secret' => env('JWT_SECRET'),
];

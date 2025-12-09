<?php

return [

    'paths' => ['*'],   // 問題なし

    'allowed_methods' => ['*'],

    // Origin 統一型ではブラウザが Laravel に直接アクセスしないので OK
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Cookie 認証は Next.js が proxy するため不要
    'supports_credentials' => false,
];

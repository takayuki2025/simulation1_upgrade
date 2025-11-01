<?php



return [



/*

|--------------------------------------------------------------------------

| Cross-Origin Resource Sharing (CORS) Configuration

|--------------------------------------------------------------------------

|

*/



// ↓ 修正案（api/* を削除し、Sanctumに必要なものだけ残す）

'paths' => ['sanctum/csrf-cookie'],
// 'paths' => ['api/*', 'sanctum/csrf-cookie'],



'allowed_methods' => ['*'],



// ★★★ 修正箇所: 環境変数でオリジンを安全に設定し、複数設定を避ける ★★★

// Nuxtのデフォルト開発ポート (3000) を指定

'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],

// 環境変数にFRONTEND_URLが設定されていない場合（.envファイル）、

// デフォルトで 'http://localhost:3000' のみ許可するようにします。



'allowed_origins_patterns' => [],



'allowed_headers' => ['*'],



'exposed_headers' => [],



'max_age' => 0,



// ★★★ Sanctum認証でCookieを使用するために必須 ★★★

'supports_credentials' => true,



];
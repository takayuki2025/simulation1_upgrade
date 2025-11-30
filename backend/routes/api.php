<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\FirebaseAuthController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Log;
use App\Http\Middleware\No401Redirect;

// ★★★ 強制ログ: ルーティングファイルが読み込まれているかを確認 ★★★
Log::info("ROUTE_FILE_LOAD_CHECK: routes/api.php loaded.");


// **********************************************
// ★★★ Sanctum 認証 API ルート (Firebase ID Token -> Sanctum Token交換) ★★★
// **********************************************

// 💡 認証の核: Firebase ID TokenをLaravelに送り、SanctumセッションとTokenを取得する
Route::post('/login_or_register', [FirebaseAuthController::class, 'handleTokenExchange'])
    ->name('api.login_or_register');

// **********************************************
// ★★★ 公開 (認証不要) API ルート ★★★
// **********************************************

// 商品詳細情報取得
Route::get('/item/{items_id}', [ItemController::class, 'item_detail_show']);

// ★★★ 修正箇所: /item を公開ルートに戻す ★★★
// フロントページ（商品一覧）取得 (未認証でもアクセス可能にするが、コントローラー内で認証を試みる)
Route::get('/item', [ItemController::class, 'index']);

// コメント取得 (GET)
Route::get('/item/{item_id}/comments', [ItemController::class, 'getComments']);






// 💡 【重要】/auth/check ルートのみに 'No401Redirect' を適用し、401を200に変換します。ルート通過後No401Redirect.phpで２０１に変換する。
Route::middleware(['auth:sanctum', No401Redirect::class])->group(function () {

    // /api/auth/check: 認証が成功した場合にのみ実行され、常に 200 OK が返される
    Route::get('/auth/check', function (Request $request) {
        return response()->json([
            'authenticated' => true,
            'message' => 'User session active.',
            'user' => $request->user()->only(['id', 'name', 'email']),
        ], 200);
    });
});

// // 💡 【一般的な保護されたルート】認証失敗時に 401 Unauthorized (赤字) を返す
// Route::middleware('auth:sanctum')->group(function () {

//     // /api/items/list は認証失敗時に本来の 401 Unauthorized を返す
//     Route::get('/items/list', function (Request $request) {
//         // ... 商品リスト取得ロジック ...
//     });
// });


// **********************************************
// ★★★ Sanctum 認証 API ルート (auth:sanctum ミドルウェアを使用) ★★★
// **********************************************

Route::middleware(['auth:sanctum'])->group(function () {

    // 認証済みユーザーのみがアクセスできるAPIエンドポイント
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // ログアウト処理 (Sanctum Tokenの取り消し)
    Route::post('/logout', [AuthController::class, 'logout']);

    // メール認証の再送
    Route::post('/email/verification-notification', [AuthController::class, 'resend'])
        ->middleware('throttle:6,1');

    // ----------------------------------------------------
    // 💡 認証済み必須のAPIエンドポイント (Sanctumで保護)
    // ----------------------------------------------------

    // プロフィール情報取得/編集画面表示
    Route::get('/mypage/profile', [ItemController::class, 'profile_revise'])->name('profile_edit');
    Route::get('/mypage', [ItemController::class, 'profile_show'])->name('profile');

    // マイページの商品リスト取得エンドポイント
    Route::get('/mypage/item', [ItemController::class, 'fetch_mypage_items']);

    // プロフィール情報更新
    Route::patch('/mypage/profile_update', [ItemController::class, 'profile_update']);

    // ユーザー画像アップロード
    Route::post('/upload2', [ItemController::class, 'user_image_upload']);

    // 購入前情報画面表示
    Route::get('/purchase/{item_id}', [ItemController::class, 'item_buy_show'])->name('item_buy');

    // 出品画面表示
    Route::get('/sell', [ItemController::class, 'item_sell_show']);
    // 出品登録と画像処理
    Route::post('/items', [ItemController::class, 'thanks_sell_create']); // 商品出品処理
    Route::post('/upload', [ItemController::class, 'item_image_upload']); // 商品画像アップロード処理

    // 配送先編集画面表示
    Route::get('/purchase/address/{item_id}/{user_id?}', [ItemController::class, 'item_purchase_edit']);

    // 購入処理関連
    Route::patch('/purchase/address/{item_id}/{user_id?}', [ItemController::class, 'update']);
    Route::post('/thanks_buy', [ItemController::class, 'thanks_buy_create'])->name('thanks_buy_create');

    // コメント投稿
    Route::post('/comment', [ItemController::class, 'comment_create']);

    // いいね機能
    Route::post('/items/{item}/favorite', [ItemController::class, 'apiFavorite']);


    // 🌟 お気に入り解除 (DELETE) を追加
    Route::delete('/items/{item}/favorite', [ItemController::class, 'apiFavorite']);

});


// メール認証の完了処理 (signedミドルウェアがセッション依存のためWebルートに移動推奨だが、APIルートに残す)
Route::get('/email/verify/{id}/{hash}', [FirebaseAuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');

// Stripe関連 (通常はWebhookとして使用されるが、ここではリダイレクト処理として残す)
Route::get('/stripe_success', [ItemController::class, 'stripeSuccess'])->name('stripe_success');

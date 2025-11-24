<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\FirebaseAuthController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Log; // Logファサードをインポート
use App\Http\Middleware\VerifyFirebaseToken; // ★ 追加：ミドルウェアクラスをインポート

// ★★★ 強制ログ: ルーティングファイルが読み込まれているかを確認 ★★★
Log::info("ROUTE_FILE_LOAD_CHECK: routes/api.php loaded.");


// **********************************************
// ★★★ Laravel11 ± React + firebaseルーティング(api) ★★★
// **********************************************


// Nuxtがページを表示する際に必要なデータ取得エンドポイントを追加します。
// 商品詳細情報取得
    Route::get('/items/{item_id}', [ItemController::class, 'item_detail_show']);
    
// フロントページ（商品一覧）取得
// 【修正点】認証情報が存在すればAuth::guard('sanctum')->user()にセットするため、ミドルウェアを適用
// ★ 修正: ミドルウェアをAPIグループ全体に移動したため、ここでの個別指定は削除します。
    Route::get('/items', [ItemController::class, 'index']); 

// コメント取得 (GET)
    Route::get('/item/{item_id}/comments', [ItemController::class, 'getComments']);


    Route::middleware('auth:sanctum')->get('/auth/check', function () {
    return response()->json([
        'authenticated' => true,
        'user' => auth()->user(),
    ]);
});

Route::get('/auth/check', function () {
    return response()->json([
        'authenticated' => auth()->check(),
    ]);
});

// Sanctum認証が必要な他のAPIルートよりも前に定義することが推奨されます
Route::post('/register_or_login', [FirebaseAuthController::class, 'handleTokenExchange'])
    ->name('api.register_or_login');








// **********************************************
// ★★★ Firebase 認証 API ルート (ログイン/登録を統合) ★★★
// **********************************************

// ログイン処理もこのエンドポイントを使用するように追加します。
    Route::post('/firebase/register', [FirebaseAuthController::class, 'registerAndLogin']);
    Route::post('/firebase/login', [FirebaseAuthController::class, 'registerAndLogin']); // ★ 追加: ログイン用ルート

    // 認証処理
    Route::post('/logout', [AuthController::class, 'logout']);


// **********************************************
// ★★★ メール認証ルート (エラー解決のため+メール認証完了処理) ★★★
// **********************************************

// Registeredイベントがトリガーするメール内のURL生成のため、
// "verification.verify" という名前のルートを定義する必要があります。
// ★ 修正: 匿名関数から FirebaseAuthController のメソッドに切り替える
    Route::get('/email/verify/{id}/{hash}', [FirebaseAuthController::class, 'verifyEmail'])
        ->middleware(['signed'])
        ->name('verification.verify');


// **********************************************
// ★★★ Sanctum 認証 API ルート (auth:sanctum ミドルウェアを使用) ★★★
// **********************************************

    // Route::middleware([VerifyFirebaseToken::class, 'auth:sanctum'])->group(function () {
    Route::middleware([VerifyFirebaseToken::class])->group(function () {
    

    // 現在のユーザー情報取得 (Pinia storeの fetchUser で使用)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    // メール認証の再送 (Webから移動)
    Route::post('/email/verification-notification', [AuthController::class, 'resend'])
        ->middleware('throttle:6,1');

    // ----------------------------------------------------
    // 💡 認証済み必須のAPIエンドポイント
    // ----------------------------------------------------
    Route::get('/mypage', [ItemController::class, 'profile_show'])->name('profile');
    // ★★★ 追記: マイページの商品リスト取得エンドポイント ★★★
    Route::get('/mypage/items', [ItemController::class, 'fetch_mypage_items']);

    // 認証済みのユーザー情報を返す（Nuxtの `fetchUser` アクションで使用）
    Route::get('/mypage/profile', [ItemController::class, 'profile_revise'])->name('profile_edit');

    // プロフィール情報更新
    // Route::patch('/profile_update', [ItemController::class, 'profile_update']);
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
});

    Route::get('/stripe_success', [ItemController::class, 'stripeSuccess'])->name('stripe_success');
// **********************************************
// ★★★ 公開 (認証不要) API ルート ★★★
// **********************************************

// Nuxtがページを表示する際に必要なデータ取得エンドポイントを追加します。
// 商品詳細情報取得
    Route::get('/items/{item_id}', [ItemController::class, 'item_detail_show']);
// フロントページ（商品一覧）取得
    Route::get('/items', [ItemController::class, 'index']);
// コメント取得 (GET)
    Route::get('/item/{item_id}/comments', [ItemController::class, 'getComments']); 
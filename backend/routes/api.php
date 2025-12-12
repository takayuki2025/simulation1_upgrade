<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\FirebaseAuthController;
// use App\Http\Controllers\ItemController;
// use App\Http\Controllers\MypageController;
// use App\Http\Controllers\ProfileController;
// use App\Http\Controllers\PurchaseController;
// use App\Http\Controllers\FavoriteController;
// use App\Http\Controllers\CommentController;
// use App\Http\Controllers\ShopController;
// use App\Http\Controllers\ShopItemController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Modules\Item\Presentation\Http\Controllers\ItemDetailController;
use App\Modules\Item\Presentation\Http\Controllers\ItemQueryController;
use App\Modules\Item\Presentation\Http\Controllers\ItemCommandController;
// use App\Modules\Item\Presentation\Http\Controllers\CommentCreateController;
use App\Modules\User\Presentation\Http\Controllers\MypageController;
use App\Modules\Item\Presentation\Http\Controllers\ShopShowController;
use App\Modules\Item\Presentation\Http\Controllers\ShopItemListController;
use App\Modules\Item\Presentation\Http\Controllers\CommentController;
use App\Modules\Item\Presentation\Http\Controllers\FavoriteController;

/* ============================================================
   🚀 1. デバッグログ（必須）
============================================================ */
Log::info("ROUTE_FILE_LOAD_CHECK: routes/api.php loaded.");

Route::get('/health', fn () => ['status' => 'ok']);


/* ============================================================
   🔐 2. Firebase 認証 → Laravel Sanctum Token 発行（必須）
============================================================ */
Route::post('/login_or_register', [FirebaseAuthController::class, 'loginOrRegister']);
Route::post('/login', [FirebaseAuthController::class, 'login']);
Route::post('/register', [FirebaseAuthController::class, 'register']);



/* ============================================================
   🌐 3. 公開 API（認証不要）
============================================================ */

// ★★★ 新しい UseCase 版 ItemQueryController に置き換え
Route::get('/item', [ItemQueryController::class, 'index']);    // 全アイテム

Route::get('/item/{id}', ItemDetailController::class);

// Route::get('/item/{id}', [ItemQueryController::class, 'show']); //もう使わない

// 🔍 カテゴリ検索
Route::get('/items/search/category', [ItemQueryController::class, 'searchByCategory']);

// 🔍 ブランド検索
Route::get('/items/search/brand', [ItemQueryController::class, 'searchByBrand']);


// コメント一覧（公開） ← これは他サービスなので現状維持
Route::get('/items/{itemId}/comments', [CommentController::class, 'list']);







Route::prefix('shops/{shop_code}')
    ->middleware('tenant')
    ->group(function () {
        Route::get('/', ShopShowController::class);           // ← 正しい
        Route::get('/items', ShopItemListController::class);  // ← 正しい
    });


// 店舗公開
// Route::prefix('shops/{shop_code}')
//     ->middleware('tenant')
//     ->group(function () {
//         Route::get('/', [ShopController::class, 'show']);
//         Route::get('/items', [ShopItemController::class, 'index']);
//     });



/* ============================================================
   🔐 4. 認証必須エリア（auth:sanctum）
============================================================ */
Route::middleware('auth:sanctum')->group(function () {

    /* ----------------------
       🔹 ログイン中ユーザー情報
    -----------------------*/
    Route::get('/me', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });

    Route::get('/user', [FirebaseAuthController::class, 'me']); // 必須

    /* ----------------------
       🔹 Logout
    -----------------------*/
    Route::post('/logout', [AuthController::class, 'logout']);



    /* ----------------------
       🔹 Profile
    -----------------------*/
   //  Route::get('/profile', [ProfileController::class, 'show']);
   //  Route::patch('/profile', [ProfileController::class, 'update']);
   //  Route::post('/profile/image', [ProfileController::class, 'uploadImage']);



    /* ----------------------
       🔹 MyPage（あなたの UseCase と連動）
    -----------------------*/
    Route::get('/mypage/profile', [MypageController::class, 'profile']);
    Route::get('/mypage/sell', [MypageController::class, 'sellItems']);
    Route::get('/mypage/bought', [MypageController::class, 'boughtItems']);



    /* ----------------------
       🔹 Item（認証が必要な操作）
    -----------------------*/


    // ★★★ 新しい CommandController を使用
    Route::post('/item', [ItemCommandController::class, 'store']);     // 作成
    Route::put('/item/{id}', [ItemCommandController::class, 'update']); // 更新
    Route::delete('/item/{id}', [ItemCommandController::class, 'destroy']); // 削除

    //  Route::post('/item', [ItemController::class, 'store']);
    //  Route::put('/item/{id}', [ItemController::class, 'update']);
    //  Route::delete('/item/{id}', [ItemController::class, 'destroy']);



    /* ----------------------
       🔹 Purchase（購入系）
    -----------------------*/
   //  Route::get('/purchase/{itemId}', [PurchaseController::class, 'check']);
   //  Route::patch('/purchase/{itemId}/address', [PurchaseController::class, 'updateAddress']);
   //  Route::post('/purchase/{itemId}', [PurchaseController::class, 'purchase']);


    /* ----------------------
       🔹 Favorite
    -----------------------*/
    Route::get('/items/favorite', [FavoriteController::class, 'index']);
    Route::post('/items/{itemId}/favorite', [FavoriteController::class, 'add']);
    Route::delete('/items/{itemId}/favorite', [FavoriteController::class, 'remove']);


    /* ----------------------
       🔹 Comment 作成
    -----------------------*/

    Route::post('/comment', CommentController::class);







    //  /* ----------------------
    //     🔹 店舗（OWNER 専用）
    //  -----------------------*/
    //  Route::post('/shops', [ShopController::class, 'store'])
    //      ->middleware('role:OWNER');


    //  Route::prefix('shops/{shop_code}')
    //      ->middleware(['tenant', 'role:OWNER'])
    //      ->group(function () {
    //          Route::post('/items', [ShopItemController::class, 'store']);
    //      });



    //  Route::get('/shops/{shopId}/items', ShopItemListController::class);

});





/* ============================================================
   📩 5. メール認証の再送（必要）
============================================================ */
Route::post('/email/resend', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Already verified'], 400);
    }
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification link sent']);
});



/* ============================================================
   📛 6. 不要 / 重複ルート（コメント化して下に隔離）
============================================================ */

/*
|--------------------------------------------------------------------------
| ❌ 重複していた user ルート（必要なし）
|--------------------------------------------------------------------------
| 上で定義済みなので不要。残すとバグ要因になるためコメント化。
*/
// Route::get('/user', function (Request $request) {
//     return response()->json(['user' => $request->user()]);
// });


/*
|--------------------------------------------------------------------------
| ❌ shops/{shop_code} の store ルートが二重
|--------------------------------------------------------------------------
| 上の OWNER グループと重複するためコメント化。
*/
// Route::prefix('shops/{shop_code}')
//     ->middleware(['tenant', 'auth:sanctum', 'role:OWNER'])
//     ->group(function () {
//         Route::post('/items', [ShopItemController::class, 'store']);
//     });

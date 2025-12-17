<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
Route::get('/health', fn () => ['status' => 'ok']);

/*
|--------------------------------------------------------------------------
| 🔐 Auth : Firebase → JWT（実装済・検証対象）
|--------------------------------------------------------------------------
*/
use App\Modules\Auth\Presentation\Http\Controllers\{
    FirebaseAuthController,
    TokenController,
    MeController,
    DeviceSessionsController
};

// Login / Register
Route::post('/login_or_register', [FirebaseAuthController::class, 'loginOrRegister']);

// Refresh Token
Route::post('/auth/refresh', [TokenController::class, 'refresh']);

/*
|--------------------------------------------------------------------------
| 🔐 JWT Protected（最低限）
|--------------------------------------------------------------------------
*/
Route::middleware(['auth.jwt'])->group(function () {
    Route::get('/me', MeController::class);
    Route::post('/logout', [FirebaseAuthController::class, 'logout']);

    // セッション確認（実装済）
    Route::get('/auth/sessions', [DeviceSessionsController::class, 'list']);
});

/*
|--------------------------------------------------------------------------
| 🌐 Public Item API（今回の検証メイン）
|--------------------------------------------------------------------------
*/
use App\Modules\Item\Presentation\Http\Controllers\{
    ItemListController,
    //  ItemSearchController,
    ItemDetailController
};
use App\Modules\Item\Presentation\Http\Controllers\PublicItemListController;
use App\Modules\Search\Presentation\Http\Controllers\PublicItemSearchController;

// ✅ 新：一覧 / 検索（DDD 分離済）
Route::prefix('items')->group(function () {
    Route::get('/', ItemListController::class);          // 一覧
    //  Route::get('/search', ItemSearchController::class);  // 検索
});

Route::prefix('search')->group(function () {
    Route::get('/items', PublicItemSearchController::class);
});

Route::middleware('auth.jwt.optional')->group(function () {
    Route::get('/items/public', PublicItemListController::class);
});



Route::middleware('auth.jwt.optional')
    ->get('/item/{id}', ItemDetailController::class);

// ✅ 詳細（単体）
// Route::get('/item/{id}', ItemDetailController::class);




use App\Http\Controllers\ItemEntityReviewController;
use App\Http\Controllers\ItemEntityAuditController;
use App\Http\Controllers\EntityKpiController;

//データー加工保管処理
Route::get('/entity-reviews', [ItemEntityReviewController::class, 'index']);
Route::post('/entity-reviews/{id}/approve', [ItemEntityReviewController::class, 'approve']);
Route::post('/entity-reviews/{id}/reject', [ItemEntityReviewController::class, 'reject']);

Route::get(
    '/item-entities/{id}/audits',
    [ItemEntityAuditController::class, 'index']
);


Route::get('/entity-kpis', EntityKpiController::class);


/*
|--------------------------------------------------------------------------
| 🧊 以下は未検証・未使用（削除せずコメント化）
|--------------------------------------------------------------------------
*/


// === 旧 Item Query（廃止予定） ===
// use App\Modules\Item\Presentation\Http\Controllers\ItemQueryController;
// Route::get('/item', [ItemQueryController::class, 'index']);
// Route::get('/items/search/category', [ItemQueryController::class, 'searchByCategory']);
// Route::get('/items/search/brand', [ItemQueryController::class, 'searchByBrand']);

// === Item Command（登録・更新・削除）===
// use App\Modules\Item\Presentation\Http\Controllers\ItemCommandController;
// Route::middleware(['auth.jwt'])->group(function () {
//     Route::post('/item', [ItemCommandController::class, 'store']);
//     Route::put('/item/{id}', [ItemCommandController::class, 'update']);
//     Route::delete('/item/{id}', [ItemCommandController::class, 'destroy']);
// });

// === Favorite / Comment ===

use App\Modules\Reaction\Presentation\Http\Controllers\FavoriteController;
use App\Modules\Comment\Presentation\Http\Controllers\PostCommentController;

Route::middleware(['auth.jwt'])->group(function () {
    Route::get('/items/favorite', [FavoriteController::class, 'index']);
    Route::post('/items/{itemId}/favorite', [FavoriteController::class, 'add']);
    Route::delete('/items/{itemId}/favorite', [FavoriteController::class, 'remove']);
});


Route::middleware(['auth.jwt'])->group(function () {
    Route::post('/comment', PostCommentController::class);
});


// === Shop / Tenant ===
use App\Modules\Item\Presentation\Http\Controllers\{
    ShopShowController,
    ShopItemListController
};

Route::prefix('shops/{shop_code}')
    ->middleware('tenant')
    ->group(function () {
        Route::get('/', ShopShowController::class);
        Route::get('/items', ShopItemListController::class);
    });

// === MyPage / User ===
use App\Modules\User\Presentation\Http\Controllers\MypageController;

Route::middleware(['auth.jwt'])->group(function () {
    Route::get('/mypage/profile', [MypageController::class, 'profile']);
    Route::get('/mypage/sell', [MypageController::class, 'sellItems']);
    Route::get('/mypage/bought', [MypageController::class, 'boughtItems']);
});

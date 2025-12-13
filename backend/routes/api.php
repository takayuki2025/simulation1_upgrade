<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Modules\Auth\Presentation\Http\Controllers\FirebaseAuthController;
use App\Modules\Auth\Presentation\Http\Controllers\TokenController;
use App\Modules\Auth\Presentation\Http\Controllers\MeController;
use App\Modules\Item\Presentation\Http\Controllers\ItemDetailController;
use App\Modules\Item\Presentation\Http\Controllers\ItemQueryController;
use App\Modules\Item\Presentation\Http\Controllers\ItemCommandController;
use App\Modules\User\Presentation\Http\Controllers\MypageController;
use App\Modules\Item\Presentation\Http\Controllers\ShopShowController;
use App\Modules\Item\Presentation\Http\Controllers\ShopItemListController;
use App\Modules\Item\Presentation\Http\Controllers\CommentController;
use App\Modules\Item\Presentation\Http\Controllers\FavoriteController;

Log::info("ROUTE_FILE_LOAD_CHECK: routes/api.php loaded.");

Route::get('/health', fn () => ['status' => 'ok']);


/* ============================================================
   🔐 Firebase → Laravel JWT 認証
============================================================ */


// Firebase → JWT
Route::post('/login_or_register', [FirebaseAuthController::class, 'loginOrRegister']);

// Refresh
Route::post('/auth/refresh', [TokenController::class, 'refresh']);

// JWT 保護エリア
Route::middleware(['auth.jwt'])->group(function () {
    Route::get('/me', MeController::class);
    Route::post('/logout', [FirebaseAuthController::class, 'logout']);
    // ...
});


Route::middleware(['auth.jwt'])->group(function () {
    Route::get('/auth/sessions', [DeviceSessionsController::class, 'list']);
});


// Email verify
Route::post('/email/verification-notification', [FirebaseAuthController::class, 'resend']);

// JWT Refresh Token
Route::post('/auth/refresh', [TokenController::class, 'refresh']);


/* ============================================================
   🌐 公開エリア（認証不要）
============================================================ */

Route::get('/item', [ItemQueryController::class, 'index']);
Route::get('/item/{id}', ItemDetailController::class);

Route::get('/items/search/category', [ItemQueryController::class, 'searchByCategory']);
Route::get('/items/search/brand', [ItemQueryController::class, 'searchByBrand']);

Route::get('/items/{itemId}/comments', [CommentController::class, 'list']);

Route::prefix('shops/{shop_code}')
    ->middleware('tenant')
    ->group(function () {
        Route::get('/', ShopShowController::class);
        Route::get('/items', ShopItemListController::class);
    });


/* ============================================================
   🔐 認証エリア（JWT ONLY）
============================================================ */

Route::middleware(['auth.jwt'])->group(function () {

    // 自分自身の取得
    Route::get('/me', MeController::class);

    // Logout
    Route::post('/logout', [FirebaseAuthController::class, 'logout']);

    // MyPage
    Route::get('/mypage/profile', [MypageController::class, 'profile']);
    Route::get('/mypage/sell', [MypageController::class, 'sellItems']);
    Route::get('/mypage/bought', [MypageController::class, 'boughtItems']);

    // Item Command
    Route::post('/item', [ItemCommandController::class, 'store']);
    Route::put('/item/{id}', [ItemCommandController::class, 'update']);
    Route::delete('/item/{id}', [ItemCommandController::class, 'destroy']);

    // Favorite
    Route::get('/items/favorite', [FavoriteController::class, 'index']);
    Route::post('/items/{itemId}/favorite', [FavoriteController::class, 'add']);
    Route::delete('/items/{itemId}/favorite', [FavoriteController::class, 'remove']);

    // Comment
    Route::post('/comment', CommentController::class);
});

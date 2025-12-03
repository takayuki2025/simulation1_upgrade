<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\FirebaseAuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\MypageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\CommentController;

// ============================================
// 🚀 1. ログ: ルートファイル読み込み確認
// ============================================
Log::info("ROUTE_FILE_LOAD_CHECK: routes/api.php loaded.");



// ================================
// 🔐 Firebase ID Token ベース認証
// ================================

// 1) ログイン専用（既存ユーザーのみ）
Route::post('/login', [FirebaseAuthController::class, 'login'])
    ->name('api.login');

// 2) 新規登録専用（存在しない場合のみ作成）
Route::post('/register', [FirebaseAuthController::class, 'register'])
    ->name('api.register');

// Firebase ID Token → Laravel 認証（Sanctum Token発行）
// 
Route::post('/login_or_register', [FirebaseAuthController::class, 'handleTokenExchange'])
    ->name('api.login_or_register');



// ================================
// 公開ルート（商品一覧など）
// ================================

// アイテム一覧・詳細
Route::get('/item', [ItemController::class, 'index']);
Route::get('/item/{itemId}', [ItemController::class, 'show']);

// コメント一覧（公開）
Route::get('/items/{itemId}/comments', [CommentController::class, 'list']);


// ============================================
// 🚀 3. 認証後ルート（auth:sanctum）
// ============================================

Route::middleware(['auth:sanctum'])->group(function () {


    Route::post('/logout', [AuthController::class, 'logout']);

    // ---- ユーザー基本情報 ----
    Route::get('/user', fn (Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // ---- Profile ----
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/image', [ProfileController::class, 'uploadImage']);

    // ---- Mypage ----
    Route::get('/mypage/profile', [MypageController::class, 'profile']);
    Route::get('/mypage/sell', [MypageController::class, 'sellItems']);
    Route::get('/mypage/bought', [MypageController::class, 'boughtItems']);

    // ---- Comment ----
    Route::post('/comment', [CommentController::class, 'create']);

    // ---- Favorite ----

    Route::get('/items/favorite', [FavoriteController::class, 'index']);

    Route::post('/items/{itemId}/favorite', [FavoriteController::class, 'add']);
    Route::delete('/items/{itemId}/favorite', [FavoriteController::class, 'remove']);

    // ---- Purchase ----
    Route::get('/purchase/{itemId}', [PurchaseController::class, 'check']);
    Route::patch('/purchase/{itemId}/address', [PurchaseController::class, 'updateAddress']);
    Route::post('/purchase/{itemId}', [PurchaseController::class, 'purchase']);
});



// ============================================
// 🚀 4. メール認証（Webミドルウェアで処理）
// ============================================
Route::get('/email/verify/{id}/{hash}', [FirebaseAuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');

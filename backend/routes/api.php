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


// ============================================
// 🔐 Firebase → Sanctum Token 認証
// ============================================

// Firebase ID Token → Laravel Token 発行
Route::post('/login_or_register', [FirebaseAuthController::class, 'loginOrRegister']);

// Firebase Login 専用
Route::post('/login', [FirebaseAuthController::class, 'login']);

// Firebase Register 専用
Route::post('/register', [FirebaseAuthController::class, 'register']);


// ============================================
// 🔑 認証が必要ない公開 API
// ============================================

// 商品一覧・詳細（公開）
Route::get('/item', [ItemController::class, 'index']);
Route::get('/item/{id}', [ItemController::class, 'show']);

// コメント一覧（公開）
Route::get('/items/{itemId}/comments', [CommentController::class, 'list']);


// ============================================
// 🔐 Token 認証（auth:sanctum）
// ============================================
Route::middleware('auth:sanctum')->group(function () {

    // --- User 情報 ---
    Route::get('/user', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });

    Route::get('/me', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });

    // --- Logout ---
    Route::post('/logout', [AuthController::class, 'logout']);


    //        これにより、ItemController::index 内で $request->user() が利用可能になる。
    // Route::get('/item', [ItemController::class, 'index']);

    // --- Item（認証が必要な操作のみ） ---
    Route::post('/item', [ItemController::class, 'store']);
    Route::put('/item/{id}', [ItemController::class, 'update']);
    Route::delete('/item/{id}', [ItemController::class, 'destroy']);

    // --- Profile ---
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/image', [ProfileController::class, 'uploadImage']);

    // --- Mypage ---
    Route::get('/mypage/profile', [MypageController::class, 'profile']);
    Route::get('/mypage/sell', [MypageController::class, 'sellItems']);
    Route::get('/mypage/bought', [MypageController::class, 'boughtItems']);

    // --- Comment 作成 ---
    Route::post('/comment', [CommentController::class, 'create']);

    // --- Favorite ---
    Route::get('/items/favorite', [FavoriteController::class, 'index']);
    Route::post('/items/{itemId}/favorite', [FavoriteController::class, 'add']);
    Route::delete('/items/{itemId}/favorite', [FavoriteController::class, 'remove']);

    // --- Purchase ---
    Route::get('/purchase/{itemId}', [PurchaseController::class, 'check']);
    Route::patch('/purchase/{itemId}/address', [PurchaseController::class, 'updateAddress']);
    Route::post('/purchase/{itemId}', [PurchaseController::class, 'purchase']);
});


// ============================================
// 📩 メール認証
// ============================================
Route::get('/email/verify/{id}/{hash}', [FirebaseAuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');

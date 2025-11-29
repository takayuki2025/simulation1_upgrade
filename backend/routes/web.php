<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\FirebaseAuthController;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

// **********************************************
// ★★★ Laravel11 ± React + Sanctumルーティング(web) ★★★
// **********************************************

// =========================================================================
// 1. Nuxt SPAのフォールバックルート (重要)
//    /api/ 以外の全てのGETリクエストはNuxtの index.blade.php を返す
// =========================================================================

Route::get('/{any}', function () {
    // このビューには Vite のアセット参照があるため、誤ってレンダリングされるとエラーになる
    return view('welcome');
})
    // /api/, /email/verify, /send-test-email 以外の全てのGETリクエストをフォールバックさせる
    ->where('any', '^(?!api\/|email\/verify|send-test-email\/).*$') // ★ CRITICAL FIX: email/verify を除外
    ->name('nuxt.fallback')
    ->middleware(['web'])
    ->methods(['GET']);


// =========================================================================
// 2. メール認証ルート (Webミドルウェア適用)
// =========================================================================

// Registeredイベントがトリガーするメール内のURL生成のため、
// "verification.verify" という名前のルートを定義する必要があります。
Route::middleware(['web'])->group(function () {
    // ★ 修正: APIルートから移動し、Webミドルウェアグループに入れる
    Route::get('/email/verify/{id}/{hash}', [FirebaseAuthController::class, 'verifyEmail'])
        ->middleware(['signed'])
        ->name('verification.verify');

    // 認証が必要な場所へのアクセスを試みた際の login ルート (JSON 401を返す)
    Route::get('/login', function () {
        return response()->json([
            'message' => 'Unauthenticated. Access to this API endpoint requires proper authentication.'
        ], 401);
    })->name('login');

    // デバッグ用: セッションが生きているかを確認するルート
    Route::get('/debug/check-auth', function () {
        $isAuthenticated = Auth::check();
        $userId = Auth::id();

        Log::info('!!! DEBUG: AUTH CHECK ROUTE HIT !!!', [
            'is_authenticated' => $isAuthenticated,
            'user_id' => $userId,
            'session_id_from_request' => session()->getId(),
        ]);

        return response()->json([
            'authenticated' => $isAuthenticated,
            'user_id' => $userId,
            'message' => $isAuthenticated ? 'Authenticated (認証済み)' : 'Unauthenticated (未認証)',
            'session_driver' => config('session.driver'),
        ], 200);

    });
});

// ----------------------------------------------------
// 3. テスト用ユーティリティ
// ----------------------------------------------------
// mailhog受信テスト用は残します。
Route::get('/send-test-email', function () {
    try {
        Mail::raw('This is a test email from Laravel.', function (\Illuminate\Mail\Message $message) {
            $message->to('test@example.com')->subject('Test Email');
        });
        return 'Email sent successfully!';
    } catch (\Exception $e) {
        return 'Failed to send email: ' . $e->getMessage();
    }
});

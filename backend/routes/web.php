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
// ★★★ Laravel11 ± React + firebaseルーティング(web) ★★★
// **********************************************























// =========================================================================
// 1. Nuxt SPAのフォールバックルート (重要)
//    /api/ 以外の全てのGETリクエストはNuxtの index.blade.php を返す
// =========================================================================
Route::get('/{any}', function () {
    return view('welcome'); 
})
    // /api/ で始まるパスは Web ルートで処理しない
    ->where('any', '^(?!api\/).*$')
    ->name('nuxt.fallback')
    ->middleware(['web'])
    ->methods(['GET']); // ★
// =========================================================================
// 3. その他 Web ミドルウェアが必要なルート
// =========================================================================
// 認証が必要な場所へのアクセスを試みた際の login ルート (JSON 401を返す)
Route::middleware(['web'])->get('/login', function () {
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

})->middleware('web');
// ----------------------------------------------------
// 5. テスト用ユーティリティ
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
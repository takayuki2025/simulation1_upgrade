<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\Auth\AuthController; // AuthControllerを使用
use App\Http\Controllers\FirebaseAuthController;
// use App\Http\Controllers\Auth\EmailVerificationController; // 削除: AuthControllerに統合済み
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log; // Log を追加


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// =========================================================================
// 1. Nuxt SPAのフォールバックルート (APIパスを完全に除外)
// =========================================================================
// // 全てのGETリクエストはNuxtに任せるため、このビューを返す。
// Route::get('{any}', function () {
//     return view('welcome'); 
// })
//     // ★★★ 決定的な修正：/api/ で始まるパスは Web ルートで処理しない ★★★
//     // これにより、POST /api/* のリクエストが Web ルートの処理に流れ込むのを防ぎます
//     ->where('any', '^(?!api\/).*$')
//     ->name('nuxt.fallback');



// =========================================================================
// 1. Nuxt SPAのフォールバックルート (重要)
//    /api/ 以外の全てのGETリクエストはNuxtの index.blade.php を返す
// =========================================================================
Route::get('/{any}', function () {
    return view('welcome'); 
})
    // /api/ で始まるパスは Web ルートで処理しない
    ->where('any', '^(?!api\/).*$')
    ->name('nuxt.fallback');


// =========================================================================
// 2. Sanctum CSRF Cookie 取得ルート (webミドルウェア必須)
// =========================================================================
Route::get('/sanctum/csrf-cookie', function (Request $request) {
    Log::info('!!! SANCTUM CSRF COOKIE ROUTE HIT !!!');
    return response('')->cookie(
        'XSRF-TOKEN', 
        $request->session()->token(), 
        config('session.lifetime') * 60,
        config('session.path'),
        config('session.domain'),
        config('session.secure'),
        false, 
        config('session.samesite')
    );
})->middleware(['web']);


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






// // 1. Nuxt SPAのルート（/ にアクセスがあった場合のみビューを返す）
// // 通常はNginx/Apacheの設定で全てをindex.phpにリライトするため、これも不要な場合がありますが、
// // 安全のため残します。
// Route::get('/', function () {
//     return view('welcome'); 
// });

// // 'web'ミドルウェアグループとCORSミドルウェアを適用
// Route::middleware(['web', HandleCors::class])->get('/login', function () {
//     // APIサーバーとして動作するため、ログイン画面ではなく JSON 401 を返す
//     return response()->json([
//         'message' => 'Unauthenticated. Access to this API endpoint requires proper authentication.'
//     ], 401);
// })->name('login');

// // ★★★ 【デバッグ用1】セッションが生きているかを確認するルート ★★★
// // ログイン成功後にフロントエンドからこのURLを叩いてください
// Route::get('/debug/check-auth', function () {
//     $isAuthenticated = Auth::check();
//     $userId = Auth::id();
    
//     // ログに出力
//     Log::info('!!! DEBUG: AUTH CHECK ROUTE HIT !!!', [
//         'is_authenticated' => $isAuthenticated,
//         'user_id' => $userId,
//         // セッションIDをログに出す (ブラウザの Cookie と比較可能)
//         'session_id_from_request' => session()->getId(),
//     ]);

//     // JSONレスポンスとして結果を返す
//     return response()->json([
//         'authenticated' => $isAuthenticated,
//         'user_id' => $userId,
//         'message' => $isAuthenticated ? 'Authenticated (認証済み)' : 'Unauthenticated (未認証)',
//         'session_driver' => config('session.driver'),
//     ], 200);

// })->middleware('web'); // webミドルウェアグループを適用

// // ★★★ 【デバッグ用2】CSRF Cookie 取得ルート (Sanctum) ★★★
// Route::get('/sanctum/csrf-cookie', function (\Illuminate\Http\Request $request) {
//     Log::info('!!! SANCTUM CSRF COOKIE ROUTE HIT !!!');
//     return response('')->cookie(
//         'XSRF-TOKEN', 
//         $request->session()->token(), 
//         config('session.lifetime') * 60,
//         config('session.path'),
//         config('session.domain'),
//         config('session.secure'),
//         false, // httpOnlyはfalse (JSで読み取る必要はないがSanctumのデフォルトに合わせる)
//         config('session.samesite')
//     );
// })->middleware(['web']);









// ★★★ 【本番用】メール認証ルートをクロージャ（無名関数）で直接定義 ★★★
// Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
//     Log::info('!!! VERIFY ROUTE HIT SUCCESSFULLY !!!', ['id' => $id, 'hash' => $hash]); 
//     return "Verification Route Hit! ID: {$id}. Please check Laravel logs for confirmation."; 
// })
//     ->name('verification.verify');



// URL は /api/email/verify/{id}/{hash} となります
// Route::get('/auth/email/verify/{id}/{hash}', [FirebaseAuthController::class, 'verifyEmail'])
//     // ->middleware(['signed']) // ★ デバッグのため、コメントアウトしたままです
//     ->name('verification.verify');

// // フロントページを表示し、持続検索機能とタブの切り替えを処理をするルーティング。
// Route::get('/', [ItemController::class, 'index'])->name('front_page');

// // 認証後のいろいろな処理を扱うルーティング
// Route::get('/onetime', [ItemController::class, 'handleOnetimeRedirect'])->name('onetime.show');


// // =========================================================================
// // ★★★ カスタム認証ルート定義（Fortifyの機能を使わずに構築） ★★★
// // =========================================================================

// // メール認証関連のルート (AuthControllerを使用)
// // メール認証通知ページを表示するルート
// Route::get('/email/verify', [AuthController::class, 'notice']) // 修正
//     ->middleware('auth')
//     ->name('verification.notice');

// // メール認証リクエストを処理するルート
// Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify']) // 修正
//     ->middleware(['auth', 'signed'])
//     ->name('verification.verify');

// // メール認証通知を再送信するルート
// Route::post('/email/verification-notification', [AuthController::class, 'resend']) // 修正
//     ->middleware(['auth', 'throttle:6,1'])
//     ->name('verification.send');

// // Fortifyが提供するデフォルトのログアウト処理
// Route::post('/logout', function (Request $request) {
//     Auth::logout();
//     $request->session()->invalidate();
//     $request->session()->regenerateToken();
//     return redirect('/');
// })->name('logout');

// // 主に基本設計書の順に並んでいます。
// Route::get('/item/{item_id}', [ItemController::class, 'item_detail_show'])->name('item_detail');

// Route::get('/purchase/{item_id}', [ItemController::class, 'item_buy_show'])->middleware(['auth'])->name('item_buy');

// Route::patch('/purchase/address/{item_id}/{user_id?}', [ItemController::class, 'update'])->name('item.purchase.update');
// Route::get('/purchase/address/{item_id}/{user_id?}', [ItemController::class, 'item_purchase_edit'])->name('item.purchase.edit');

// Route::get('/sell', [ItemController::class, 'item_sell_show'])->middleware(['auth'])->name('item_sell');

// Route::get('/mypage', [ItemController::class, 'profile_show'])->middleware(['auth'])->name('profile');

// // 🌟 修正：メール認証コントローラのリダイレクト先とテストが期待するルート 🌟
// Route::get('/mypage/profile', [ItemController::class, 'profile_revise'])->middleware(['auth'])->name('profile_edit');

// Route::post('/thanks_sell', [ItemController::class, 'thanks_sell_create']);
// Route::get('/thanks_sell', [ItemController::class, 'thanks_sell_create']);


// //購入処理（コンビニ払い完了処理まで/カード支払いstripe決済に繋げる処理）のルード
// Route::post('/thanks_buy', [ItemController::class, 'thanks_buy_create'])->name('thanks_buy_create');
// // カード支払いstripeでの処理
// Route::get('/stripe_success', [ItemController::class, 'stripeSuccess'])->name('stripe_success');
// // コンビニ/カード支払い共に処理完了後のページ移動のルード
// Route::get('/thanks_buy', [ItemController::class, 'thanks_buy_show'])->name('thanks_buy');


// // ユーザー情報の更新、出品商品登録、コメント投稿、いいね機能
// Route::patch('/profile_update', [ItemController::class, 'profile_update']);

// Route::post('/upload2', [ItemController::class, 'user_image_upload']);

// Route::post('/upload', [ItemController::class, 'item_image_upload']);

// Route::post('/comment_read', [ItemController::class, 'comment_create'])->name('comment_create');

// Route::post('/items/{item}/favorite', [ItemController::class, 'favorite'])->name('item.favorite');


// // mailhog受信テスト用
// Route::get('/send-test-email', function () {
//     try {
//         Mail::raw('This is a test email from Laravel.', function (\Illuminate\Mail\Message $message) {
//             $message->to('test@example.com')->subject('Test Email');
//         });
//         return 'Email sent successfully!';
//     } catch (\Exception $e) {
//         return 'Failed to send email: ' . $e->getMessage();
//     }
// });

// =========================================================================
// Fortifyコントローラへの参照とカスタムAuthControllerへの参照を整理します。
// =========================================================================

// Route::group(['middleware' => ['web']], function () {
//     $fortifyControllers = 'Laravel\Fortify\Http\Controllers\\';
    
//     登録ルート (AuthControllerを使用)
//     Route::get('/register', [AuthController::class, 'createRegister'])->name('register');
//     Route::post('/register', [AuthController::class, 'storeRegister']);

//     ログインルート (AuthControllerを使用 - カスタムリクエスト/ロジック適用)
//     Route::get('/login', [AuthController::class, 'createLogin'])->name('login'); // ★ 修正
//     Route::post('/login', [AuthController::class, 'storeLogin']); // ★ 修正

//     パスワードリセットルート (Fortifyを使用)
//     Route::get('/forgot-password', $fortifyControllers . 'PasswordResetLinkController@create')->name('password.request');
//     Route::post('/forgot-password', $fortifyControllers . 'PasswordResetLinkController@store')->name('password.email');
//     Route::get('/reset-password/{token}', $fortifyControllers . 'NewPasswordController@create')->name('password.reset');
//     Route::post('/reset-password', $fortifyControllers . 'NewPasswordController@store')->name('password.update');
    
//     // プロフィール情報更新ルート (Fortifyを使用)
//     Route::put('/user/profile-information', $fortifyControllers . 'ProfileInformationController@update')->middleware(['auth'])->name('user-profile-information.update');
    
//     // パスワード更新ルート (Fortifyを使用)
//     Route::put('/user/password', $fortifyControllers . 'PasswordController@update')->middleware(['auth'])->name('user-password.update');
// });

// 🌟 削除：便宜的なprofile_editルートを削除し、/mypage/profileのルート名'profile_edit'を優先させます。
// Route::get('/profile', function () {
//     return view('profile.edit'); 
// })->middleware(['auth', 'verified'])->name('profile_edit');





/*
|--------------------------------------------------------------------------
| Web Routes (for Nuxt SPA)
|--------------------------------------------------------------------------
|
| LaravelがHTMLを返す必要のあるルート、またはNuxt SPAのルーティングに関係のない
| 単発のユーティリティルート（例：テストメール送信）のみを残します。
| 認証後のページ表示系ルートは全てNuxt側で処理されます。
|
*/


// ----------------------------------------------------
// 1. Nuxt SPAのルートフォールバック（推奨はしませんが、index.phpへの入り口として）
// ----------------------------------------------------
// Nuxtが全てのフロントエンドパスを処理するため、Webルートは極力シンプルにします。
// フロントページを表示するルートは削除し、Nginxの設定（index.phpへのフォールバック）に任せるか、
// もしテストなどで必要なら残します。
// Route::get('/', [ItemController::class, 'index'])->name('front_page'); 


// ----------------------------------------------------
// 2. 認証後のWebページ表示ルート (APIサーバー化に伴い**全て削除**)
// ----------------------------------------------------
// Nuxtが担当するため、以下のルートは routes/api.php に機能（POST/PATCH）を移動し、
// Web表示ルート（GET）は削除します。
// Route::get('/onetime', [ItemController::class, 'handleOnetimeRedirect'])->name('onetime.show');
// Route::get('/item/{item_id}', [ItemController::class, 'item_detail_show'])->name('item_detail');
// ... その他、item_buy_show, item_sell_show, profile_show なども削除 ...


// ----------------------------------------------------
// 3. メール認証関連のルート (API連携のため**すべて削除**)
// ----------------------------------------------------
// メール認証関連の処理（notice, verify, resend）はAPI化し、APIまたはNuxtに任せます。
// Route::get('/email/verify', ...), Route::get('/email/verify/{id}/{hash}', ...) などは削除


// ----------------------------------------------------
// 4. Fortifyが提供するデフォルトのログアウトルート (API連携のため**削除**)
// ----------------------------------------------------
// ログアウト処理は /api/logout として API ルートに移動します。
// Route::post('/logout', function (Request $request) { ... })->name('logout');


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


// ----------------------------------------------------
// 6. APIとして残すべき POST/PATCH ルート (APIへ移動を推奨)
// ----------------------------------------------------
// Webルートに残す必要はありません。すべて /api/* として api.php に移動してください。
// Route::patch('/purchase/address/{item_id}/{user_id?}', ...)
// Route::post('/thanks_sell', ...)
// ... など全て API へ移動 ...

// 💡 最終的に、SPAとして動作させるために、Webルートは最小限にするか、
// Nginxで index.php にフォールバックさせてNuxtに処理を委譲するのが理想です。
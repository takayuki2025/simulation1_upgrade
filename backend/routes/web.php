<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Auth\FirebaseAuthController;

use App\Modules\Auth\Presentation\Http\Controllers\VerifyEmailController;









Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
->middleware(['signed'])->name('verification.verify');




// ========== API サーバーとしての root ==========
Route::get('/', function () {
    return response()->json([
        'message' => 'Laravel API is running.',
        'time' => now()->toDateTimeString(),
    ]);
});

// ========== メール認証 ==========
// Route::middleware(['web'])->group(function () {
//     // Route::get('/email/verify/{id}/{hash}', [FirebaseAuthController::class, 'verifyEmail'])
//     //     ->middleware(['signed'])
//     //     ->name('verification.verify');

//     Route::get('/login', function () {
//         return response()->json(['message' => 'Unauthenticated'], 401);
//     })->name('login');
// });

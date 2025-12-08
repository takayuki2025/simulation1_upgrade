<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Application\UseCase\Auth\LoginOrRegisterUseCase;

use App\Models\User;

use Illuminate\Auth\Events\Verified;



class FirebaseAuthController extends Controller
{
    public function __construct(
        private LoginOrRegisterUseCase $loginOrRegisterUseCase
    ) {
    }

    public function loginOrRegister(Request $request)
    {
        Log::info("🔥 login_or_register START", [
            'request_body' => $request->all(),
        ]);

        $request->validate([
            'id_token' => 'required|string',
        ]);

        // ユースケース呼び出し
        $result = $this->loginOrRegisterUseCase->execute($request->id_token);

        $user = $result['user'];
        $status = $result['status'];

        // ⭐⭐⭐ 新規ユーザーの場合のみメール送信
        if ($status === 'register') {
            Log::info("📩 Sending Email Verification", [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            $user->sendEmailVerificationNotification();
        }

        // JWT 発行
        $token = $user->createToken('firebase_login')->plainTextToken;

        Log::info("✅ Login/Register Success", [
            'status' => $status,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'status' => $status,
            'token'  => $token,
            'user'   => $user,
        ]);
    }


    // ============================
    // メール認証後の処理（オプション）
    // ============================
    public function verifyEmail(Request $request)
{
    $user = User::findOrFail($request->route('id'));

    // ハッシュチェック
    if (! hash_equals(sha1($user->getEmailForVerification()), (string)$request->route('hash'))) {
        return redirect(config('app.frontend_url') . '/email/invalid');
    }

    if ($user->hasVerifiedEmail()) {
        return redirect(config('app.frontend_url') . '/mypage/profile');
    }

    if ($user->markEmailAsVerified()) {
        event(new Verified($user));
    }

    // Listener でセットした URL を使う
    $redirectUrl = session('redirect_after_verify', config('app.frontend_url'));

    return redirect($redirectUrl);
}
}

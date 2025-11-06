<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Requests\RegisterRequest; // カスタムリクエストをインポート
use App\Http\Requests\LoginRequest; // ★ LoginRequestをインポート (修正)
use Illuminate\Validation\ValidationException; // (修正)

use Illuminate\Support\Facades\Hash; // Hashをインポート
/**
 * 認証関連の全般的なカスタム処理を担うコントローラ。
 * (新規登録、ログイン、メール認証など)
 */
class AuthController extends BaseController
{
    // ===============================================
    // ★★★ 新規登録機能 (CustomRegisteredUserControllerから移行) ★★★
    // ===============================================

    /**
     * ログインフォーム表示 (Webルート用。APIでは使用しない)
     */
    public function createLogin()
    {
        // Nuxt側で処理するため、APIでは使用しない。
        // WebルートがFortifyに依存している場合は、Fortifyのコントローラが使用されるべき。
        // return view('auth.login'); 
    }

    /**
     * ユーザーを認証し、Sanctumトークンを返す (API)
     */
    public function storeLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            // 既存のトークンを削除し、新しいトークンを発行
            $user->tokens()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;

            // ログイン成功時にユーザー情報とトークンを返す
            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                ],
            ]);
        }

        // 認証失敗時は401 Unauthorizedを返す
        throw ValidationException::withMessages([
            'email' => ['メールアドレスまたはパスワードが正しくありません。'],
        ]);
    }

    /**
     * 登録フォーム表示 (Webルート用。APIでは使用しない)
     */
    public function createRegister()
    {
        // Nuxt側で処理するため、APIでは使用しない。
        // return view('auth.register');
    }
    
    /**
     * 新規ユーザーを登録し、メール認証通知を送信する (API)
     * * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeRegister(Request $request) // 💡 RegisterRequestからRequestに変更 (API向け)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 登録イベントを発火し、メール認証通知を送信
        event(new Registered($user));

        // ★ 修正: Auth::login($user) とリダイレクトを削除し、成功JSONを返す
        return response()->json([
            'message' => 'User registered successfully. Verification email sent.',
        ], 201);
    }

    /**
     * ログアウト処理 (API)
     */
    public function logout(Request $request)
    {
        // ユーザーが認証されているかチェックする (Sanctumがユーザーを特定できた場合)
        if ($request->user()) {
            
            // ★ 修正: currentAccessToken() が null の可能性があるため、安全にチェックする
            // ユーザーに紐づくトークンがあれば削除する
            // Sanctumトークンは $request->user()->currentAccessToken() で取得できるが、
            // Firebase側でサインアウト済みの場合、不整合が起こりやすいため、
            // ユーザーオブジェクトのトークンコレクション全体から現在のトークンを削除する方が安全。
            
            // 1. 現在使用されているトークンを取得 (nullチェックを追加)
            $currentAccessToken = $request->user()->currentAccessToken();
            
            if ($currentAccessToken) {
                // 2. トークンが存在すれば削除
                $currentAccessToken->delete();
                
                // 成功メッセージを返す
                return response()->json([
                    'message' => 'Successfully logged out and token revoked.'
                ], 200);
            }
            
            // トークンが既になかった場合も、成功として扱う
        }

        // そもそもユーザーが認証されていない、またはトークンがなかった場合も成功としてフロントに返す
        return response()->json(['message' => 'Logged out successfully.'], 200);
    }


    // ===============================================
    // メール認証関連 (Web & API)
    // ===============================================
    
    /**
     * メール認証通知ページを表示します。
     * (Webルート: /email/verify)
     * * @return \Illuminate\View\View|\Illuminate\Http\JsonResponse
     */
    public function notice()
    {
        // ★ 修正後のロジック: Bladeビューではなく、JSONまたはリダイレクトを返す
        // ただし、Fortifyやweb.phpの互換性のためにビューを返す設定を残す場合もある
        // ここでは、Nuxtクライアントへのリダイレクトを前提に、Bladeビューを返す処理を維持
        return view('auth.verify-email');
    }


    /**
     * メール認証リクエストを処理します。
     * (Webルート: /email/verify/{id}/{hash} - Nuxtへのリダイレクトが必須)
     * * @param  \Illuminate\Foundation\Auth\EmailVerificationRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verify(EmailVerificationRequest $request)
    {
        // ユーザーのメールがすでに確認済みかチェック
        if ($request->user()->hasVerifiedEmail()) {
            // ★ 修正: Nuxtのプロフィール編集ルートにリダイレクト
            return redirect()->to(route('profile_edit'));
        }

        // メールを検証済みとしてマーク
        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        // 認証後のリダイレクト先をNuxtのフロントエンドURLに強制
        // ★ 修正: Nuxtのプロフィール編集ルートにリダイレクト
        return redirect()->to(route('profile_edit'))->with('verified', true);
    }


    /**
     * メール認証通知を再送信します。
     * (APIルート: /api/email/verification-notification - NuxtからのPOST)
     * * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resend(Request $request)
    {
        // 認証済みユーザーに通知メールを再送信
        $request->user()->sendEmailVerificationNotification();

        // Bladeビューではなく、成功JSONを返す
        return response()->json(['status' => 'verification-link-sent'], 202);
    }
}
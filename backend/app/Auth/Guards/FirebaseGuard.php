<?php

namespace App\Auth\Guards;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Exception\Auth\InvalidToken;
use Illuminate\Auth\GuardHelpers;
use App\Models\User; // ★ 追加: EloquentモデルUserをインポート

class FirebaseGuard implements Guard
{
    use GuardHelpers;

    protected $auth;
    protected $request;
    protected $provider;
    protected $user;

    /**
     * コンストラクタ
     *
     * @param UserProvider $provider Laravelのユーザープロバイダー (通常はEloquent)
     * @param FirebaseAuth $auth Kreait\Firebase\Contract\Auth のインスタンス
     * @param Request $request 現在のHTTPリクエスト
     */
    public function __construct(UserProvider $provider, FirebaseAuth $auth, Request $request)
    {
        $this->provider = $provider;
        $this->auth = $auth;
        $this->request = $request;
    }

    /**
     * 現在認証されているユーザーを取得します。
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function user()
    {
        if (!is_null($this->user)) {
            return $this->user;
        }

        // 1. リクエストヘッダーからFirebase IDトークンを取得
        $token = $this->request->bearerToken();

        if (empty($token)) {
            return null;
        }

        // 2. トークンを検証し、ユーザーをロード
        return $this->user = $this->retrieveByToken($token);
    }

    /**
     * トークン（IDトークン）からユーザーを取得します。
     *
     * @param string $token Firebase IDトークン
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    protected function retrieveByToken(string $token)
    {
        try {
            // Firebase IDトークンの検証とデコード
            $verifiedIdToken = $this->auth->verifyIdToken($token);

            // トークンからFirebase UIDを取得
            $uid = $verifiedIdToken->claims()->get('sub');

            // ★ 修正箇所: Eloquentを直接使用して'firebase_uid'で検索
            // UserProviderのretrieveByIdはプライマリキーを想定しているため、カスタム検索に置き換える
            $user = User::where('firebase_uid', $uid)->first();

            // ユーザーが見つからない場合は、Firebaseで認証されたがアプリのDBには未登録の状態
            if (!$user) {
                \Illuminate\Support\Facades\Log::warning('User not found in DB for Firebase UID: ' . $uid);
                // ここでユーザーを新規作成するロジックを挿入することもできます
                // 例: $user = $this->createUserFromFirebaseToken($verifiedIdToken);
            }

            return $user;

        } catch (InvalidToken $e) {
            // トークンが無効、期限切れ、改ざんなどの場合は認証失敗
            \Illuminate\Support\Facades\Log::warning('Firebase ID Token validation failed: ' . $e->getMessage());
            return null;
        } catch (\Exception $e) {
            // その他のエラー
            \Illuminate\Support\Facades\Log::error('Authentication error: ' . $e->getMessage());
            return null;
        }
    }


    /**
     * ユーザーを資格情報で認証しようとします（このガードでは使用しない）。
     *
     * @param array $credentials
     * @return bool
     */
    public function validate(array $credentials = [])
    {
        return false; // APIトークン認証なので、credentialによるvalidateは使用しない
    }

    // 以下のメソッドは、Guardインターフェースを満たすために必要ですが、API認証では通常使用しません。

    /**
     * ユーザーを設定します。
     *
     * @param \Illuminate\Contracts\Auth\Authenticatable $user
     * @return void
     */
    public function setUser(\Illuminate\Contracts\Auth\Authenticatable $user)
    {
        $this->user = $user;
    }
}
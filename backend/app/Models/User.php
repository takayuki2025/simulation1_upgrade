<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
// ★追加: メール検証URL生成に必要なクラス
// use Illuminate\Support\Carbon;
// use Illuminate\Support\Facades\Config;
// use Illuminate\Support\Facades\URL;

use App\Notifications\CustomVerifyEmail;

// use Illuminate\Auth\Notifications\VerifyEmail; // sendEmailVerificationNotificationで使用　

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    /**
     * マスアサインメント時に設定可能な属性。
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'post_number',
        'address',
        'building',
        'user_image',
        'address_country',
        'firebase_uid',
    ];

    /**
     * 配列に含めない属性。
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * ネイティブタイプにキャストする必要がある属性。
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // --- リレーションシップの定義 (既存のまま) ---

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    public function orderHistories(): HasMany
    {
        return $this->hasMany(OrderHistory::class);
    }

    public function goods(): HasMany
    {
        return $this->hasMany(Good::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // --- メール認証URLのカスタムロジックの追加 ---


    // /**
    //  * メール検証通知のためのURLを取得します。
    //  *
    //  * @param  \App\Models\User  $notifiable
    //  * @return string
    //  */
    // protected function verificationUrl($notifiable)
    // {
    //     // ★ 修正後のロジック: NuxtのフロントエンドURLを強制的に使用する ★

    //     // 1. NuxtのフロントエンドURLを取得 (例: http://localhost:3000)
    //     $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000'); // .envにAPP_FRONTEND_URLを設定してください

    //     // 2. Laravelのデフォルトの署名付きURLを生成 (この時点ではホストはLaravelのAPP_URL)
    //     $url = URL::temporarySignedRoute(
    //         'verification.verify',
    //         Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
    //         [
    //             'id' => $notifiable->getKey(),
    //             'hash' => sha1($notifiable->getEmailForVerification()),
    //         ]
    //     );

    //     // 3. URLをパースし、ホストをフロントエンドのものに置き換える
    //     $parsedUrl = parse_url($url);
    //     $frontendParsed = parse_url($frontendUrl);

    //     $scheme = $frontendParsed['scheme'] ?? 'http';
    //     $host = $frontendParsed['host'] ?? 'localhost';
    //     $port = $frontendParsed['port'] ?? '';

    //     $path = $parsedUrl['path'] ?? '';
    //     $query = $parsedUrl['query'] ?? '';

    //     // 4. 新しいURLを構築
    //     // ホスト部分をフロントエンドの情報に置き換える
    //     $fixedUrl = $scheme . '://' . $host;

    //     // ポートがあれば追加
    //     if ($port) {
    //         $fixedUrl .= ":{$port}";
    //     }

    //     // パスとクエリを追加
    //     $fixedUrl .= $path;
    //     $fixedUrl .= $query ? '?' . $query : '';

    //     return $fixedUrl;
    // }

    /**
     * メール検証通知をユーザーに送信します。
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        // ★★★ インポートしたクラス名を使用する ★★★
        $this->notify(new CustomVerifyEmail());
    }

}

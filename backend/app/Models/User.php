<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'shop_id',
        // 'role',
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
        'shop_id' => 'integer',
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


    public function cartItems()
    {
        // ユーザーは複数のカートアイテムを持つ (中間テーブル cart_items を介する)
        return $this->hasMany(CartItem::class);
    }

    // ユーザーがカートに入れている商品を直接取得したい場合 (Many-to-Many)
    public function cart()
    {
        // itemsテーブルと関連付け
        return $this->belongsToMany(Item::class, 'cart_items')
                    ->withPivot('quantity') // cart_itemsテーブルのquantityカラムも取得
                    ->withTimestamps();
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class)
            ->withPivot('shop_id')
            ->withTimestamps();
    }




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

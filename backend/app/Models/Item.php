<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'price',
        'explain',
        'condition',
        'category',
        'item_image',
        'brand',
        'remain',
        'shop_id',
    ];

    protected $casts = [
        'category' => 'array',
    ];

    /** 画像URLアクセサ（既存コードそのまま） */
    public function getItemImageAttribute($value): string
    {
        return $value ?? '';
    }


    /** 出品者 */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** ⭐ お気に入り（Good） */
    public function favorites(): HasMany
    {
        return $this->hasMany(Good::class);
    }

    /** コメント */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // この商品がどのユーザーのカートに入っているかを関連付ける
    public function usersInCart()
    {
        // usersテーブルと関連付け
        return $this->belongsToMany(User::class, 'cart_items')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}

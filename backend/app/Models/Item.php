<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo; 
use Illuminate\Support\Facades\Storage; // ★ 追加: Storageファサードをインポート

class Item extends Model
{
    use HasFactory;

    /**
     * プライマリキー
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * 複数代入可能な属性
     * @var array<int, string>
     */
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
    ];
    
    /**
     * ネイティブタイプへキャストする属性
     * @var array
     */
    protected $casts = [
        'category' => 'array',
    ];

    /**
     * 商品画像パスを絶対URLとして取得するためのアクセサ
     *
     * JSONシリアライズ時や $item->item_image でアクセスされたときに実行され、
     * パスを App URL に基づく絶対URLに変換してフロントエンドに渡します。
     *
     * @param string|null $value データベースに保存されているitem_imageの値
     * @return string
     */
    public function getItemImageAttribute($value): string
    {
        if ($value) {
            // パスが存在する場合、asset() ヘルパーを使って絶対URLを生成
            // 例: 'storage/item_images/xxx.jpg' -> 'http://localhost/storage/item_images/xxx.jpg'
            // ※ asset() は .env の APP_URL を使用します。
            return asset($value); 
        }

        // 画像がない場合は空文字列を返す。
        return ''; 
    }


    /**
     * モデルが属するUserを取得します。
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 商品に付けられたGoodを取得します。
     * @return HasMany
     */
    public function goods(): HasMany
    {
        return $this->hasMany(Good::class);
    }

    /**
     * 商品に付けられたCommentを取得します。
     * @return HasMany
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
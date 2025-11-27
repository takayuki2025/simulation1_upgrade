<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str; // Strクラスを追加で使用

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
     * 商品画像パスを絶対URLとして取得するためのアクセサ（最終確定版）
     *
     * @param string|null $value データベースに保存されているitem_imageの値
     * @return string
     */
    public function getItemImageAttribute($value): string
    {
        if (!$value) {
            // 画像パスがない場合は空文字列を返す
            return '';
        }

        // ★★★ 根本解決ロジック：既にフルURLであれば、そのまま加工せずに返す ★★★
        if (Str::startsWith(strtolower($value), ['http://', 'https://'])) {
            // DBにフルURLが保存されている場合、このアクセサによる二重結合を防ぐ
            return $value;
        }

        // 信頼できる唯一の情報源であるAPP_URLを直接取得
        $baseUrl = Config::get('app.url');

        if (!$baseUrl) {
            // APP_URLが設定されていない場合は、フォールバックとしてurl()を使用
            return url($value);
        }

        // APP_URLをパースして、スキーム、ホスト、ポートを強制的に抽出します。
        $parts = parse_url($baseUrl);

        // ベースURLのパーツを再構築 (https://laravel.test:4430 のような形式)
        $scheme = $parts['scheme'] ?? 'https';
        $host = $parts['host'] ?? '';
        $port = $parts['port'] ?? null;

        // 正しいホスト名とポート番号を含むベース部分を構築
        $basePrefix = "{$scheme}://{$host}" . ($port ? ":{$port}" : '');

        // 画像パスのスラッシュを削除（もしあれば）
        $path = ltrim($value, '/');

        // ベースとパスを結合して、完全で正しい絶対URLを手動で生成
        $finalUrl = "{$basePrefix}/{$path}";

        // !!! IMPORTANT: ここでデバッグコードや文字列を返さないこと !!!
        return $finalUrl;
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

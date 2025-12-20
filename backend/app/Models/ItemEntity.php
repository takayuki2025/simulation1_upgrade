<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemEntity extends Model
{
    protected $table = 'item_entities';

    protected $fillable = [
        'item_id',
        'brand_entity_id',
        'condition_entity_id',
        'color_entity_id',
        'confidence',
        'is_latest',
        'generated_version',
        'generated_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'confidence'   => 'array',
        'is_latest'    => 'boolean',
    ];

    /* =============================
       既存（そのまま）
    ============================= */

    public function brandEntity(): BelongsTo
    {
        return $this->belongsTo(
            BrandEntity::class,
            'brand_entity_id'
        );
    }

    /* =============================
       🔥 追加（これが必須）
    ============================= */

    /** 商品本体 */
    public function item(): BelongsTo
    {
        return $this->belongsTo(
            Item::class,
            'item_id'
        );
    }

    /** 正規化ブランド */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(
            BrandEntity::class,
            'brand_entity_id'
        );
    }

    /** 正規化コンディション */
    public function condition(): BelongsTo
    {
        return $this->belongsTo(
            ConditionEntity::class,
            'condition_entity_id'
        );
    }

    /** 正規化カラー */
    public function color(): BelongsTo
    {
        return $this->belongsTo(
            ColorEntity::class,
            'color_entity_id'
        );
    }
}

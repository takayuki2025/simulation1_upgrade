<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemEntityTag extends Model
{
    protected $table = 'item_entity_tags';

    protected $fillable = [
        'item_id',
        'tag_type',
        'entity_id',
        'display_name',
        'confidence',
    ];

    protected $casts = [
        'confidence' => 'float',
    ];

    /** 商品 */
    public function item(): BelongsTo
    {
        return $this->belongsTo(
            Item::class,
            'item_id'
        );
    }

    /**
     * 汎用 entity（brand / color / condition）
     * v1 では join しないので optional
     */
    public function entity(): BelongsTo
    {
        return $this->belongsTo(
            BrandEntity::class,
            'entity_id'
        );
    }
}

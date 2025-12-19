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
        'generated_version',
        'generated_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
    ];

    public function brandEntity(): BelongsTo
    {
        return $this->belongsTo(BrandEntity::class, 'brand_entity_id');
    }
}

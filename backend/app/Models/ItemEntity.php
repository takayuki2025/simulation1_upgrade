<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ItemEntity extends Model
{
    protected $fillable = [
        'item_id',
        'entity_type',
        'raw_value',
        'canonical_value',
        'confidence',
        'decision',
        'policy_version',
        'schema_version',
        'engine_version',
        'extensions',
        'is_latest',
    ];

    protected $casts = [
        'extensions' => 'array',
        'confidence' => 'float',
        'is_latest' => 'boolean',
    ];
}


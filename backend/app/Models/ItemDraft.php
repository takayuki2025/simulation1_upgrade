<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class ItemDraft extends Model
{
    protected $table = 'item_drafts';

    protected $fillable = [
        'user_id',
        'shop_id',
        'name',
        'price',
        'brand',
        'status',
        'item_image',
        'explain',
        'condition',
        'category',
        'remain',
    ];

    protected $casts = [
        'category' => 'array',
    ];
}
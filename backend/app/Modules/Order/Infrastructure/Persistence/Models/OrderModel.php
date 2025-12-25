<?php

namespace App\Modules\Order\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

final class OrderModel extends Model
{
    protected $table = 'orders';

    protected $guarded = [];

    public $timestamps = true;

    protected $fillable = [
        'shop_id',
        'user_id',
        'status',
        'total_amount',
        'currency',
        'items_snapshot',
        'meta',
    ];

    protected $casts = [
        'items_snapshot' => 'array',
        'meta' => 'array',
        'address_snapshot_at' => 'datetime',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\RoleUser;
use App\Models\User;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_code',
        'name',
        'owner_user_id',
        'description',
        'logo',
    ];

    /**
     * 店舗オーナー（User）
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    /**
     * この店舗の商品一覧
     */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    public function roleUsers()
    {
        return $this->hasMany(RoleUser::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'role_user')
            ->using(RoleUser::class)
            ->withPivot('role_id')
            ->withTimestamps();
    }
}

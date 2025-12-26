<?php

namespace App\Modules\User\Infrastructure\Persistence\Repository;

use App\Modules\User\Domain\Entity\UserAddress;
use App\Modules\User\Domain\Repository\UserAddressRepository;
use App\Models\UserAddress as UserAddressModel;

final class EloquentUserAddressRepository implements UserAddressRepository
{
    public function findPrimaryByUser(int $userId): ?UserAddress
    {
        $model = UserAddressModel::where('user_id', $userId)
            ->where('is_primary', true)
            ->first();

        if (! $model) {
            return null;
        }

        return new UserAddress(
            id: $model->id,
            userId: $model->user_id,
            postalCode: $model->postal_code,
            prefecture: $model->prefecture,
            city: $model->city,
            addressLine1: $model->address_line1,
            addressLine2: $model->address_line2,
            recipientName: $model->recipient_name,
            phone: $model->phone,
            isPrimary: $model->is_primary,
        );
    }
}

<?php

namespace App\Infrastructure\Persistence;

use App\Domain\Repository\ProfileRepository;
use App\Models\User;

class EloquentProfileRepository implements ProfileRepository
{
    public function find(int $userId): array
    {
        $user = User::findOrFail($userId);

        return [
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'post_number' => $user->post_number,
            'address'     => $user->address,
            'building'    => $user->building,
            'user_image'  => $user->user_image,
        ];
    }

    public function update(int $userId, array $data): bool
    {
        $user = User::findOrFail($userId);

        $user->fill([
            'name'  => $data['name'] ?? $user->name,
            'email' => $data['email'] ?? $user->email,
        ]);

        return $user->save();
    }

    public function updateImage(int $userId, string $path): bool
    {
        return User::where('id', $userId)
            ->update(['user_image' => $path]) > 0;
    }

    public function updateAddress(int $userId, string $postNumber, string $address, ?string $building): bool
    {
        return User::where('id', $userId)
            ->update([
                'post_number' => $postNumber,
                'address'     => $address,
                'building'    => $building,
            ]) > 0;
    }
}

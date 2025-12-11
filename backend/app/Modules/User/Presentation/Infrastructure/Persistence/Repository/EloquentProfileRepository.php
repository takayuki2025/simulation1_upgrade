<?php

namespace App\Modules\User\Presentation\Infrastructure\Persistence\Repository;

use App\Modules\User\Presentation\Domain\Entity\Profile;
// ✅ 新しいインターフェース名を使用
use App\Modules\User\Presentation\Domain\Repository\ProfileRepository;
use App\Models\User; // Eloquent Model

// ✅ インターフェースを実装する
class EloquentProfileRepository implements ProfileRepository
{
    public function find(int $userId): ?Profile
    {
        $user = User::select(
            'id',
            'name',
            'email',
            'post_number',
            'address',
            'building',
            'user_image',
            'email_verified_at'
        )
            ->find($userId);

        if (!$user) {
            return null;
        }

        return $this->toEntity($user);
    }

    public function update(int $userId, array $data): Profile
    {
        $user = User::findOrFail($userId);

        // 更新可能なフィールドだけを反映
        $user->fill([
            'name'        => $data['name']        ?? $user->name,
            'post_number' => $data['post_number'] ?? $user->post_number,
            'address'     => $data['address']     ?? $user->address,
            'building'    => $data['building']    ?? $user->building,
        ]);

        $user->save();

        return $this->toEntity($user);
    }

    public function updateImage(int $userId, string $path): Profile
    {
        $user = User::findOrFail($userId);
        $user->user_image = $path;
        $user->save();

        return $this->toEntity($user);
    }

    public function updateAddress(
        int $userId,
        string $postNumber,
        string $address,
        ?string $building
    ): Profile {
        $user = User::findOrFail($userId);
        $user->post_number = $postNumber;
        $user->address     = $address;
        $user->building    = $building;
        $user->save();

        return $this->toEntity($user);
    }

    private function toEntity(User $user): Profile
    {
        // ... (UserProfile::fromArrayを使っても良いが、今回はこのまま)
        return new Profile(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            postNumber: $user->post_number,
            address: $user->address,
            building: $user->building,
            userImage: $user->user_image,
            emailVerifiedAt: $user->email_verified_at
                ? new \DateTimeImmutable($user->email_verified_at)
                : null,
        );
    }
}

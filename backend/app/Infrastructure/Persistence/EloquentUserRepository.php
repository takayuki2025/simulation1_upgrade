<?php

namespace App\Infrastructure\Persistence;

use App\Domain\Repository\UserRepository;
use App\Models\User;

class EloquentUserRepository implements UserRepository
{
    public function find(int $id): ?array
    {
        $u = User::find($id);
        if (!$u) {
            return null;
        }

        return [
            'id'              => $u->id,
            'name'            => $u->name,
            'email'           => $u->email,
            'email_verified_at' => $u->email_verified_at,
            'post_number'     => $u->post_number,
            'address'         => $u->address,
            'building'        => $u->building,
        ];
    }

    public function findModel(int $id): ?User
    {
        return User::find($id);
    }
}

<?php

namespace App\Modules\User\Application\UseCase;

use App\Modules\User\Application\Dto\ProfileDto;
use App\Modules\User\Domain\Repository\ProfileRepository;
use App\Modules\User\Domain\Repository\UserAddressRepository;
use App\Modules\Shop\Application\UseCase\EnsureShopAddressFromProfileUseCase;
use RuntimeException;

final class ProfileUseCase
{
    public function __construct(
        private ProfileRepository $profiles,
        private UserAddressRepository $addresses,
        private EnsureShopAddressFromProfileUseCase $ensureShopAddress,
    ) {
    }

    public function getProfile(int $userId): ProfileDto
    {
        $profile = $this->profiles->find($userId);

        if (! $profile) {
            throw new RuntimeException('User profile not found.');
        }

        return ProfileDto::fromEntity($profile);
    }

    /**
     * プロフィール更新
     * - users を更新
     * - primary UserAddress が無ければ作成
     * - 同一内容なら保存しない
     */
    public function updateProfile(int $userId, array $data): ProfileDto
{
    $current = $this->profiles->find($userId);

    if (! $current) {
        throw new RuntimeException('User profile not found.');
    }

    // 差分チェック
    $noChange =
        ($data['name']        ?? $current->name())        === $current->name()
     && ($data['post_number'] ?? $current->postNumber()) === $current->postNumber()
     && ($data['address']     ?? $current->address())    === $current->address()
     && ($data['building']    ?? $current->building())   === $current->building();

    if ($noChange) {
        return ProfileDto::fromEntity($current);
    }

    // User プロフィール更新
    $profile = $this->profiles->update($userId, $data);

    // UserAddress primary 保証
    $primary = $this->addresses->findPrimaryByUser($userId);

    if (
        ! $primary
        && $profile->postNumber()
        && $profile->address()
    ) {
        $this->addresses->createPrimaryFromProfile(
            $userId,
            $profile
        );
    }

    // 👇 ここだけ追加（Shop 側の整合性は別UseCaseへ）
    $this->ensureShopAddress->handle($userId);

    return ProfileDto::fromEntity($profile);
}


    public function updateProfileImage(int $userId, string $path): ProfileDto
    {
        $profile = $this->profiles->updateImage($userId, $path);
        return ProfileDto::fromEntity($profile);
    }
}
<?php

namespace App\Modules\User\Application\UseCase;

// ✅ DTO の use 文を ProfileDto に修正
use App\Modules\User\Application\Dto\ProfileDto;
use App\Modules\User\Domain\Repository\ProfileRepository;
use RuntimeException;

class ProfileUseCase
{
    public function __construct(
        private ProfileRepository $profiles
    ) {
    }

    /**
     * Entityベースのユースケース
     */
    // ✅ 戻り値の型ヒントを UserProfileDto に修正
    public function getProfile(int $userId): ProfileDto
    {
        $profile = $this->profiles->find($userId);

        if (!$profile) {
            throw new RuntimeException('User profile not found.');
        }

        // ✅ 内部コードのクラス名は UserProfileDto で正しい
        return ProfileDto::fromEntity($profile);
    }

    // ✅ updateProfile の戻り値の型ヒントを UserProfileDto に修正
    public function updateProfile(int $userId, array $data): ProfileDto
    {
        $profile = $this->profiles->update($userId, $data);
        return ProfileDto::fromEntity($profile);
    }

    // ✅ updateProfileImage の戻り値の型ヒントを UserProfileDto に修正
    public function updateProfileImage(int $userId, string $path): ProfileDto
    {
        $profile = $this->profiles->updateImage($userId, $path);
        return ProfileDto::fromEntity($profile);
    }

    // ✅ updateProfileAddress の戻り値の型ヒントを UserProfileDto に修正
    public function updateProfileAddress(int $userId, array $data): ProfileDto
    {
        $profile = $this->profiles->updateAddress(
            $userId,
            $data['post_number'],
            $data['address'],
            $data['building'] ?? null,
        );

        return ProfileDto::fromEntity($profile);
    }

    // ... (AsArray メソッドは変更不要)

    public function getProfileAsArray(int $userId): array
    {
        $profileDto = $this->getProfile($userId);
        return $profileDto->toArray();
    }   
}

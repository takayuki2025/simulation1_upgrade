<?php

namespace App\Modules\Auth\Application\UseCase;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Log;

class VerifyEmailUseCase
{
    public function handle(int $userId, string $hash): bool
    {
        $user = User::find($userId);

        if (!$user) {
            Log::warning('[VerifyEmail] user not found', ['id' => $userId]);
            return false;
        }

        // ハッシュ検証
        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            Log::warning('[VerifyEmail] invalid hash', [
                'id' => $userId,
                'expected' => sha1($user->getEmailForVerification()),
                'given' => $hash
            ]);
            return false;
        }

        // すでに認証済み
        if ($user->hasVerifiedEmail()) {
            Log::info('[VerifyEmail] already verified', ['id' => $userId]);
            return true;
        }

        // 認証処理
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
            Log::info('[VerifyEmail] success', ['id' => $userId]);
        }

        return true;
    }
}

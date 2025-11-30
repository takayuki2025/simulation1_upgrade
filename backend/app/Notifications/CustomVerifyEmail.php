<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends BaseVerifyEmail
{
    /**
     * メールメッセージを構築
     */
    public function toMail($notifiable)
    {
        $verifyUrl = $this->verificationUrl($notifiable);

        return (new MailMessage())
            ->subject('メールアドレスの確認')
            ->line('メールアドレスを確認するには、以下のボタンをクリックしてください。')
            ->action('メールアドレスの確認', $verifyUrl)
            ->line('もしアカウント作成にお心当たりがない場合は、このメールを無視してください。');
    }

    /**
     * 検証URLを生成
     */
    protected function verificationUrl($notifiable)
    {
        \Log::info('✅ CustomVerifyEmail CALLED');
        \Log::info('✅ APP_URL = ' . env('APP_URL'));

        $temporarySignedURL = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );

        $appUrl = env('APP_URL', 'https://laravel.test:4430');
        $parsed = parse_url($temporarySignedURL);

        $finalUrl = rtrim($appUrl, '/') . ($parsed['path'] ?? '');
        if (isset($parsed['query'])) {
            $finalUrl .= '?' . $parsed['query'];
        }

        return $finalUrl;
    }
}

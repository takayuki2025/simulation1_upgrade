<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
// Domain Repositories
// NOTE: UserRepositoryInterface は App\Domain\Repository\UserRepository に置き換えられていると想定
use App\Domain\Repository\OrderHistoryRepository;
use App\Domain\Repository\CommentRepository;
use App\Domain\Repository\FavoriteRepository;
use App\Domain\Repository\ItemRepositoryInterface;
// ✅ User モジュール内の Repository Interface を追加
use App\Modules\User\Presentation\Domain\Repository\ProfileRepository;//⚫️
use App\Modules\User\Presentation\Domain\Repository\MypageRepository; // ⚫️MypageRepositoryは共通で残す
// Infrastructure Persistence
use App\Infrastructure\Persistence\EloquentUserRepository; // 既存のUserRepository
use App\Modules\User\Presentation\Infrastructure\Persistence\Repository\EloquentProfileRepository;//⚫️
use App\Infrastructure\Persistence\EloquentOrderHistoryRepository;
use App\Infrastructure\Persistence\EloquentCommentRepository;
use App\Infrastructure\Persistence\EloquentFavoriteRepository;
use App\Infrastructure\Persistence\EloquentItemRepository;
// ✅ User モジュール内の Repository 実装クラスのパスを修正
use App\Modules\User\Presentation\Infrastructure\Persistence\Repository\EloquentMypageRepository;// ⚫️MypageRepositoryは共通で残す
// use App\Modules\User\Infrastructure\Persistence\Repository\EloquentProfileRepository;
// Ports
use App\Domain\Payment\StripePaymentPort;
use App\Domain\Auth\FirebaseAuthPort;
// Adapters
use App\Infrastructure\Payment\StripePaymentAdapter;
use App\Infrastructure\Auth\FirebaseAuthAdapter;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Repository binding
        $this->app->bind(ItemRepositoryInterface::class, EloquentItemRepository::class);
        // $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class); // 仮にコメントアウト
        $this->app->bind(OrderHistoryRepository::class, EloquentOrderHistoryRepository::class);
        $this->app->bind(CommentRepository::class, EloquentCommentRepository::class);
        $this->app->bind(FavoriteRepository::class, EloquentFavoriteRepository::class);

        // ✅ Mypage は User モジュール内の Eloquent 版を採用
        $this->app->bind(MypageRepository::class, EloquentMypageRepository::class);

        $this->app->bind(ProfileRepository::class, EloquentProfileRepository::class);

        // ✅ ProfileRepository を User モジュール内の実装クラスにバインド
        // $this->app->bind(ProfileRepository::class, EloquentProfileRepository::class);

        // Firebase Auth Port
        $this->app->bind(FirebaseAuthPort::class, function ($app) {
            return new FirebaseAuthAdapter(
                $app->make('firebase.auth')
            );
        });

        // Stripe Payment
        $this->app->bind(StripePaymentPort::class, StripePaymentAdapter::class);
    }

    public function boot()
    {
    }
}

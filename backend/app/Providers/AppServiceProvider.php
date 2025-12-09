<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
// ========== Domain Repositories ==========
// use App\Domain\Repository\ItemRepository;
use App\Domain\Repository\UserRepository;
use App\Domain\Repository\UserRepositoryInterface;
use App\Domain\Repository\OrderHistoryRepository;
use App\Domain\Repository\CommentRepository;
use App\Domain\Repository\FavoriteRepository;
use App\Domain\Repository\ItemRepositoryInterface;
use App\Domain\Repository\MypageRepository;
// ========== Infrastructure Persistence ==========
// use App\Infrastructure\Persistence\EloquentItemRepository;
use App\Infrastructure\Persistence\EloquentUserRepository;
use App\Infrastructure\Persistence\EloquentOrderHistoryRepository;
use App\Infrastructure\Persistence\EloquentCommentRepository;
use App\Infrastructure\Persistence\EloquentFavoriteRepository;
use App\Infrastructure\Persistence\EloquentItemRepository;
// ========== Domain Ports ==========
use App\Domain\Payment\StripePaymentPort;
use App\Domain\Auth\FirebaseAuthPort;
// ========== Infrastructure Adapters ==========
use App\Infrastructure\Payment\StripePaymentAdapter;
use App\Infrastructure\Auth\FirebaseAuthAdapter;
// ========== Infrastructure Repositories ==========
use App\Infrastructure\Repository\MypageRepositoryImpl;
// ========== Use Cases ==========
use App\Application\UseCase\Mypage\MypageUseCase;

// Firebase SDK
use Kreait\Firebase\Contract\Auth as FirebaseSdk;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Repository binding
        $this->app->bind(ItemRepositoryInterface::class, EloquentItemRepository::class);
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        $this->app->bind(OrderHistoryRepository::class, EloquentOrderHistoryRepository::class);
        $this->app->bind(CommentRepository::class, EloquentCommentRepository::class);
        $this->app->bind(FavoriteRepository::class, EloquentFavoriteRepository::class);


        $this->app->bind(MypageRepository::class, MypageRepositoryImpl::class);



        // Firebase Auth Port

        $this->app->bind(FirebaseAuthPort::class, function ($app) {
            return new FirebaseAuthAdapter(
                $app->make('firebase.auth')   // ← これが正しい！！
            );
        });


        // Stripe Payment
        $this->app->bind(StripePaymentPort::class, StripePaymentAdapter::class);
    }

    public function boot()
    {
    }
}

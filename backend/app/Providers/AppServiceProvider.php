<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
// ========== Domain Repositories ==========
use App\Domain\Repository\ItemRepository;
use App\Domain\Repository\UserRepository;
use App\Domain\Repository\OrderHistoryRepository;
use App\Domain\Repository\CommentRepository;
use App\Domain\Repository\FavoriteRepository;
// ========== Infrastructure Persistence ==========
use App\Infrastructure\Persistence\EloquentItemRepository;
use App\Infrastructure\Persistence\EloquentUserRepository;
use App\Infrastructure\Persistence\EloquentOrderHistoryRepository;
use App\Infrastructure\Persistence\EloquentCommentRepository;
use App\Infrastructure\Persistence\EloquentFavoriteRepository;
// ========== Domain Ports ==========
use App\Domain\Payment\StripePaymentPort;
use App\Domain\Auth\FirebaseAuthPort;
// ========== Infrastructure Adapters ==========
use App\Infrastructure\Payment\StripePaymentAdapter;
use App\Infrastructure\Auth\FirebaseAuthAdapter;
// Firebase SDK
use Kreait\Firebase\Contract\Auth as FirebaseSdk;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        /*
        |--------------------------------------------------------------------------
        | Repository Binding
        |--------------------------------------------------------------------------
        */
        $this->app->bind(ItemRepository::class, EloquentItemRepository::class);
        $this->app->bind(UserRepository::class, EloquentUserRepository::class);
        $this->app->bind(OrderHistoryRepository::class, EloquentOrderHistoryRepository::class);
        $this->app->bind(CommentRepository::class, EloquentCommentRepository::class);
        $this->app->bind(FavoriteRepository::class, EloquentFavoriteRepository::class);

        /*
        |--------------------------------------------------------------------------
        | External Adapters (Auth / Payment)
        |--------------------------------------------------------------------------
        */

        $this->app->bind(FirebaseAuthPort::class, function ($app) {
            return new FirebaseAuthAdapter(
                $app->make(\Kreait\Firebase\Contract\Auth::class)
            );
        });


        // ✔ 正しい Stripe バインディング
        $this->app->bind(StripePaymentPort::class, StripePaymentAdapter::class);

        /*
        |--------------------------------------------------------------------------
        | UseCase
        |--------------------------------------------------------------------------
        */
        $this->app->bind(\App\Application\UseCase\ItemUseCase::class);
        $this->app->bind(\App\Application\UseCase\MypageUseCase::class);
        $this->app->bind(\App\Application\UseCase\Purchase\PurchaseUseCase::class);
        $this->app->bind(\App\Application\UseCase\CommentUseCase::class);
        $this->app->bind(\App\Application\UseCase\FavoriteUseCase::class);
        $this->app->bind(\App\Application\UseCase\Auth\AuthUseCase::class);
    }

    public function boot()
    {
    }
}

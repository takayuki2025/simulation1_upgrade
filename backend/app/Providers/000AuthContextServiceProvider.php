<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Modules\Auth\Application\Service\AuthContext;

class AuthContextServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AuthContext::class, function ($app) {
            return new AuthContext(
                $app['request']
            );
        });
    }
}

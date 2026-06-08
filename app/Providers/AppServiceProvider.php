<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\RateLimiter;

use App\Repositories\Contracts\TrainingProgramRepositoryInterface;
use App\Repositories\Eloquent\TrainingProgramRepository;
use App\Repositories\Contracts\TrainerOpportunityRepositoryInterface;
use App\Repositories\Eloquent\TrainerOpportunityRepository;
use App\Repositories\Contracts\CompanyPackageRepositoryInterface;
use App\Repositories\Eloquent\CompanyPackageRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(TrainingProgramRepositoryInterface::class, TrainingProgramRepository::class);
        $this->app->bind(TrainerOpportunityRepositoryInterface::class, TrainerOpportunityRepository::class);
        $this->app->bind(CompanyPackageRepositoryInterface::class, CompanyPackageRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        RateLimiter::for('subscriptions-create', function (Request $request) {
            return Limit::perMinute(20)->by((string) $request->ip());
        });
    }
}

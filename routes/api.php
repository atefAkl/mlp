<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\AdminSubscriberController;
use App\Http\Controllers\Api\ReferenceDataController;
use App\Http\Controllers\Api\TrainingProgramController;
use App\Http\Controllers\Api\TrainerOpportunityController;
use App\Http\Controllers\Api\CompanyPackageController;

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

Route::post('/login', [AuthController::class, 'login']);

// Subscription Wizard Routes
Route::get('/subscribe/meta', [SubscriptionController::class, 'meta']);
Route::post('/subscribe', [SubscriptionController::class, 'store'])->middleware('throttle:subscriptions-create');
Route::get('/subscribe/public/{publicId}', [SubscriptionController::class, 'showPublic']);

// Public Read Routes
Route::get('/training-programs', [TrainingProgramController::class, 'index']);
Route::get('/training-programs/{id}', [TrainingProgramController::class, 'show']);
Route::get('/trainer-opportunities', [TrainerOpportunityController::class, 'index']);
Route::get('/trainer-opportunities/{id}', [TrainerOpportunityController::class, 'show']);
Route::get('/company-packages', [CompanyPackageController::class, 'index']);
Route::get('/company-packages/{id}', [CompanyPackageController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // User Management
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::post('/users/bulk-delete', [UserController::class, 'bulkDestroy']);
    
    // Roles Management
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
    Route::post('/roles/bulk-delete', [RoleController::class, 'bulkDestroy']);

    // Permissions Management
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::post('/permissions', [PermissionController::class, 'store']);
    Route::put('/permissions/{permission}', [PermissionController::class, 'update']);
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy']);
    Route::post('/permissions/bulk-delete', [PermissionController::class, 'bulkDestroy']);

    // Subscribers Management
    Route::middleware('manage.subscribers')->group(function () {
        Route::get('/admin/subscribers', [AdminSubscriberController::class, 'index']);
        Route::get('/admin/subscribers/grouped', [AdminSubscriberController::class, 'grouped']);
        Route::post('/admin/subscribers/selection', [AdminSubscriberController::class, 'selection']);
        Route::get('/admin/subscribers/stats', [AdminSubscriberController::class, 'stats']);
        Route::get('/admin/subscribers/trends', [AdminSubscriberController::class, 'trends']);
        Route::get('/admin/subscribers/{type}/{subscription}', [AdminSubscriberController::class, 'show']);
        Route::patch('/admin/subscribers/{subscription}/status', [AdminSubscriberController::class, 'updateStatus']);
        Route::patch('/admin/subscribers/bulk-status', [AdminSubscriberController::class, 'bulkUpdateStatus']);
        Route::post('/admin/subscribers/{subscription}/resend-email', [AdminSubscriberController::class, 'resendEmail']);

        Route::get('/admin/reference-data', [ReferenceDataController::class, 'index']);
        Route::post('/admin/reference-data/{resource}', [ReferenceDataController::class, 'store']);
        Route::put('/admin/reference-data/{resource}/{id}', [ReferenceDataController::class, 'update']);
        Route::delete('/admin/reference-data/{resource}/{id}', [ReferenceDataController::class, 'destroy']);
    });

    // Training Programs Management
    Route::post('/training-programs', [TrainingProgramController::class, 'store']);
    Route::put('/training-programs/{id}', [TrainingProgramController::class, 'update']);
    Route::delete('/training-programs/{id}', [TrainingProgramController::class, 'destroy']);
    Route::patch('/training-programs/{id}/activate', [TrainingProgramController::class, 'activate']);
    Route::patch('/training-programs/{id}/deactivate', [TrainingProgramController::class, 'deactivate']);

    // Trainer Opportunities Management
    Route::post('/trainer-opportunities', [TrainerOpportunityController::class, 'store']);
    Route::put('/trainer-opportunities/{id}', [TrainerOpportunityController::class, 'update']);
    Route::delete('/trainer-opportunities/{id}', [TrainerOpportunityController::class, 'destroy']);
    Route::patch('/trainer-opportunities/{id}/activate', [TrainerOpportunityController::class, 'activate']);
    Route::patch('/trainer-opportunities/{id}/deactivate', [TrainerOpportunityController::class, 'deactivate']);

    // Company Packages Management
    Route::post('/company-packages', [CompanyPackageController::class, 'store']);
    Route::put('/company-packages/{id}', [CompanyPackageController::class, 'update']);
    Route::delete('/company-packages/{id}', [CompanyPackageController::class, 'destroy']);
    Route::patch('/company-packages/{id}/activate', [CompanyPackageController::class, 'activate']);
    Route::patch('/company-packages/{id}/deactivate', [CompanyPackageController::class, 'deactivate']);
});

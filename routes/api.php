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

Route::post('/login', [AuthController::class, 'login']);
Route::get('/subscriptions/meta', [SubscriptionController::class, 'meta']);
Route::post('/subscriptions', [SubscriptionController::class, 'store'])->middleware('throttle:subscriptions-create');
Route::get('/subscriptions/public/{publicId}', [SubscriptionController::class, 'showPublic']);

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
});

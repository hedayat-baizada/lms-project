<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
   

    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');



     Route::resource('users', UserController::class);
     Route::resource('roles', RoleController::class);
      Route::resource('permissions', PermissionController::class);
        // ->middleware('role:Super Admin');

});




Route::get('/apply', function () {
    return Inertia::render('Apply/Index');
})->name('apply.index');

Route::get('/apply/student', [ApplicationController::class, 'student'])
    ->name('apply.student');

Route::post('/apply/student/personal-info', [ApplicationController::class, 'storePersonalInfo'])
    ->name('apply.student.personal-info.store');

    Route::get('/apply/student/{application}/document', function () {
    return 'Document step coming next';
})->name('apply.student.document');

Route::get('/track', function () {
    return Inertia::render('Apply/Track');
})->name('apply.track');




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

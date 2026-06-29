<?php

use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;

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

Route::get('/applications', [AdminApplicationController::class, 'index'])
    ->name('applications.index');

    Route::get('/applications/{application}', [AdminApplicationController::class, 'show'])
    ->name('applications.show');

    Route::post('/applications/{application}/score', [AdminApplicationController::class, 'score'])
    ->name('applications.score');

    Route::post('/applications/{application}/reject', [AdminApplicationController::class, 'reject'])
    ->name('applications.reject');

Route::post('/applications/{application}/request-correction', [AdminApplicationController::class, 'requestCorrection'])
    ->name('applications.request-correction');

    Route::get('/applications/{application}/placement-test', [AdminApplicationController::class, 'placementTest'])
    ->name('applications.placement-test');

    Route::get('/applications/{application}/writing', [AdminApplicationController::class, 'writingReview'])
    ->name('applications.writing');

    Route::get('/applications/{application}/speaking', [AdminApplicationController::class, 'speakingReview'])
    ->name('applications.speaking');
   

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


    

    Route::get('/apply/student/{application}/document', [ApplicationController::class, 'document'])
    ->name('apply.student.document');

Route::post('/apply/student/{application}/document', [ApplicationController::class, 'storeDocument'])
    ->name('apply.student.document.store');


    

Route::get('/apply/student/{application}/course', [ApplicationController::class, 'course'])
    ->name('apply.student.course');

Route::post('/apply/student/{application}/course', [ApplicationController::class, 'storeCourse'])
    ->name('apply.student.course.store');

Route::get('/apply/student/{application}/test', [ApplicationController::class, 'test'])
    ->name('apply.student.test');

Route::get('/apply/student/{application}/review', [ApplicationController::class, 'review'])
    ->name('apply.student.review');

Route::post('/apply/student/{application}/review/submit', [ApplicationController::class, 'submitFinal'])
    ->name('apply.student.submit-final');

Route::post('/apply/student/{application}/test/draft', [ApplicationController::class, 'saveTestDraft'])
    ->name('apply.student.test.draft');



Route::post('/apply/student/{application}/test', [ApplicationController::class, 'storeTestAnswers'])
    ->name('apply.student.test.store');

Route::get('/apply/student/{application}/writing', [ApplicationController::class, 'writing'])
    ->name('apply.student.writing');

Route::post('/apply/student/{application}/writing', [ApplicationController::class, 'storeWriting'])
    ->name('apply.student.writing.store');


    Route::get('/apply/student/{application}/speaking', [ApplicationController::class, 'speaking'])
    ->name('apply.student.speaking');

Route::post('/apply/student/{application}/speaking', [ApplicationController::class, 'storeSpeaking'])
    ->name('apply.student.speaking.store');


Route::post('/apply/student/{application}/test/drafts', [ApplicationController::class, 'saveTestDrafts'])
    ->name('apply.student.test.drafts');

    Route::post('/apply/student/{application}/speaking/start', [ApplicationController::class, 'startSpeaking'])
    ->name('apply.student.speaking.start');


Route::get('/track', [ApplicationController::class, 'track'])
    ->name('apply.track');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

<?php

use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\TeamApplicationController;
use App\Http\Controllers\TeamApplicationReviewController;

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

    Route::post('/applications/{application}/approve', [AdminApplicationController::class, 'approve'])
    ->name('applications.approve');




    Route::get('/apply/student/{application}/correction', [ApplicationController::class, 'correction'])
    ->name('apply.student.correction');

Route::post('/apply/student/{application}/correction', [ApplicationController::class, 'storeCorrection'])
    ->name('apply.student.correction.store');



    Route::get('/applications/{application}/history', [AdminApplicationController::class, 'history'])
    ->name('applications.history');




    Route::get('/approved-applicants', [AdminApplicationController::class, 'approvedApplicants'])
    ->name('approved-applicants.index');

Route::get('/approved-applicants/{application}', [AdminApplicationController::class, 'showApprovedApplicant'])
    ->name('approved-applicants.show');


    Route::get('/apply/team', function () {
    return Inertia::render('Apply/Team/ChooseRole');
})->name('apply.team');






Route::get('/apply/team/teacher/{subject}', [TeamApplicationController::class, 'teacher'])
    ->name('apply.team.teacher');

Route::post('/apply/team/teacher/{subject}', [TeamApplicationController::class, 'storeTeacher'])
    ->name('apply.team.teacher.store');


    Route::get('/apply/team/{teamApplication}/submitted', [TeamApplicationController::class, 'submitted'])
    ->name('apply.team.submitted');

    Route::get('/apply/team/form', [TeamApplicationController::class, 'create'])
    ->name('apply.team.form');

Route::post('/apply/team/form', [TeamApplicationController::class, 'store'])
    ->name('apply.team.store');



    Route::get('/team-applications/{teamApplication}/correction-review', [TeamApplicationReviewController::class, 'correctionReview'])
    ->name('team-applications.correction-review');



    Route::get('/approved-staffs', [TeamApplicationReviewController::class, 'approvedStaffs'])
    ->name('approved-staffs.index');

Route::get('/approved-staffs/{teamApplication}', [TeamApplicationReviewController::class, 'showApprovedStaff'])
    ->name('approved-staffs.show');


Route::prefix('team-applications')->group(function () {

    Route::get('/', [TeamApplicationReviewController::class, 'index'])
        ->name('team-applications.index');

    Route::get('/{teamApplication}', [TeamApplicationReviewController::class, 'show'])
        ->name('team-applications.show');

            Route::post('/{teamApplication}/approve', [TeamApplicationReviewController::class, 'approve'])
        ->name('team-applications.approve');

    Route::post('/{teamApplication}/reject', [TeamApplicationReviewController::class, 'reject'])
        ->name('team-applications.reject');

    Route::post('/{teamApplication}/request-correction', [TeamApplicationReviewController::class, 'requestCorrection'])
        ->name('team-applications.request-correction');

});


Route::get('/approved-teachers', [TeamApplicationReviewController::class, 'approvedTeachers'])
    ->name('approved-teachers.index');



    Route::get(
    '/rejected-students',
    [AdminApplicationController::class, 'rejectedStudents']
)->name('rejected-students.index');


Route::get(
    '/rejected-team-applications',
    [TeamApplicationReviewController::class, 'rejectedTeamApplications']
)->name('rejected-team-applications.index');


   

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

    Route::get('/apply/student/{application}/instructions', [ApplicationController::class, 'instructions'])
    ->name('apply.student.instructions');

Route::post('/apply/student/{application}/test/draft', [ApplicationController::class, 'saveTestDraft'])
    ->name('apply.student.test.draft');


    Route::get('/apply/student/{application}/submitted', [ApplicationController::class, 'submitted'])
    ->name('apply.student.submitted');

    Route::post('/apply/student/{application}/speaking/skip', [ApplicationController::class, 'skipSpeaking'])
    ->name('apply.student.speaking.skip');



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




    Route::get('/apply/team/{teamApplication}/correction', [TeamApplicationController::class, 'correction'])
    ->name('apply.team.correction');

Route::post('/apply/team/{teamApplication}/correction', [TeamApplicationController::class, 'storeCorrection'])
    ->name('apply.team.correction.store');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\DashboardController;


//teacher panel 

use App\Http\Controllers\Teacher\AssignmentStatuesController;
use App\Http\Controllers\Teacher\AttendanceRecordController;
use App\Http\Controllers\Teacher\AttendanceSessionController;
use App\Http\Controllers\Teacher\ClassAsssignmentController;
use App\Http\Controllers\Teacher\MyClassController;
use App\Http\Controllers\Teacher\NotificationController;
use App\Http\Controllers\Teacher\SessionController;
use App\Http\Controllers\Teacher\TeacherDashbordController;



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

    //teacher panel routes
        
            //dashbord
    Route::get('/teacherdashbord',[TeacherDashbordController::class, 'index'])->middleware(['auth'])->name('teacherdashbord');
            
        
            //attendance
    Route::get('/attendancesession',[AttendanceSessionController::class,'index'])->middleware(['auth'])->name('attendancesession');
    Route::get('/attendancerecored',[AttendanceRecordController::class,'index'])->middleware(['auth'])->name('attendancerecord');

        //assignment
    Route::get('/classassignment',[ClassAsssignmentController::class, 'index'])->middleware(['auth'])->name('classassignment');
    Route::get('/assignmentstatues',[AssignmentStatuesController::class, 'index'])->middleware(['auth'])->name('assignmentstatues');

        //myclass
    Route::get('/myclass',[MyClassController::class,'index'])->middleware(['auth'])->name('myclass');

        //session
    Route::get('/session',[SessionController::class,'index'])->middleware(['auth'])->name('session');

        //notification
    Route::get('/notification',[NotificationController::class, 'index'])->middleware(['auth'])->name('notification');

        
});







require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

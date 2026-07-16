<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Api\ClassRoomController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\HomeworkController;
use App\Http\Controllers\Api\FinalExamController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\StudentProgressController;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {

    // ==================== Dashboard ====================
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware(['auth'])
        ->name('dashboard');

    // ==================== Admin Resources (Spatie) ====================
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);

    // ==================== Admin Inertia Pages ====================
    Route::prefix('admin')->group(function () {
        Route::get('classes', function () {
            return Inertia::render('Admin/classes/index');
        });
        Route::get('classes/{id}', function ($id) {
            return Inertia::render('Admin/classes/show', ['classId' => (int) $id]);
        });
        Route::get('classes/{id}/exam', function ($id) {
            return Inertia::render('Admin/classes/exam', ['classId' => (int) $id]);
        });
        Route::get('students', function () {
            return Inertia::render('Admin/students/index');
        });
        Route::get('teachers', function () {
            return Inertia::render('Admin/teachers/index');
        });
    });

    // ==================== Teacher Inertia Pages ====================
    Route::prefix('teacher')->group(function () {
        Route::get('/', function () {
            return Inertia::render('teacher/index');
        });
        Route::get('classes', function () {
            return Inertia::render('teacher/classes/index');
        });
        Route::get('classes/{classId}', function ($classId) {
            return Inertia::render('teacher/classes/show', ['classId' => (int) $classId]);
        });
        Route::get('homework', function () {
            return Inertia::render('teacher/homework/index');
        });
        Route::get('attendance', function () {
            return Inertia::render('teacher/attendance/index');
        });
        Route::get('exams', function () {
            return Inertia::render('teacher/exams/index');
        });
    });

    // ==================== Student Inertia Pages ====================
    Route::prefix('student')->group(function () {
        Route::get('/', function () {
            return Inertia::render('student/index');
        });
        Route::get('classes', function () {
            return Inertia::render('student/classes/index');
        });
        Route::get('classes/{id}', function ($id) {
            return Inertia::render('student/classes/show', ['classId' => (int) $id]);
        });
        Route::get('classes/{id}/exam', function ($id) {
            return Inertia::render('student/classes/exam', ['classId' => (int) $id]);
        });
        Route::get('results', function () {
            return Inertia::render('student/results/index');
        });
    });

    // ==================== API Routes (بدون Sanctum، با Session) ====================

    // ---- Admin Stats ----
    // FIX: هم ستون role (سیستم قدیمی) و هم رول Spatie (سیستم User Management) چک می‌شود
    // تا کاربرانی که از هرکدام از دو مسیر ساخته شده‌اند دیده شوند.
    Route::get('/api/admin/stats', function () {
        return response()->json([
            'total_students' => \App\Models\User::where('role', 'student')
                ->orWhereHas('roles', fn($q) => $q->where('name', 'Student'))
                ->count(),
            'total_teachers' => \App\Models\User::where('role', 'teacher')
                ->orWhereHas('roles', fn($q) => $q->where('name', 'Teacher'))
                ->count(),
            'total_classes'  => \App\Models\ClassRoom::count(),
            'total_lessons'  => \App\Models\Lesson::count(),
            'total_homework_submissions' => \App\Models\HomeworkSubmission::count(),
            'pending_homework' => \App\Models\HomeworkSubmission::where('status', 'pending')->count(),
            'total_exam_submissions' => \App\Models\FinalExamSubmission::count(),
            'pending_attendance' => \App\Models\AttendanceRequest::where('status', 'pending')->count(),
            'recent_students' => \App\Models\User::where('role', 'student')
                ->orWhereHas('roles', fn($q) => $q->where('name', 'Student'))
                ->latest()->take(5)->get(['id', 'name', 'email', 'created_at']),
        ]);
    })->middleware('auth');

    // ---- Admin Lists ----
    // FIX: همان منطق بالا برای لیست دانش‌آموزان و معلمان
    Route::get('/api/admin/students', function () {
        return \App\Models\User::where('role', 'student')
            ->orWhereHas('roles', fn($q) => $q->where('name', 'Student'))
            ->get();
    })->middleware('auth');

    Route::get('/api/admin/teachers', function () {
        return \App\Models\User::where('role', 'teacher')
            ->orWhereHas('roles', fn($q) => $q->where('name', 'Teacher'))
            ->get();
    })->middleware('auth');

    // ---- Admin User Management ----
    // FIX: هنگام ساخت کاربر از این مودال، رول Spatie هم assign می‌شود
    // تا با سیستم User Management (که از roles.view/create/edit استفاده می‌کند) هماهنگ بماند.
    Route::post('/api/admin/users', function (Request $request) {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role'     => 'required|in:student,teacher',
        ]);

        $user = \App\Models\User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'role'     => $request->role,
        ]);

        // هم‌زمان رول Spatie را هم می‌دهیم: 'teacher' -> 'Teacher', 'student' -> 'Student'
        $user->assignRole(ucfirst($request->role));

        return response()->json($user, 201);
    })->middleware('auth');

    Route::put('/api/admin/users/{user}', function (Request $request, \App\Models\User $user) {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
        ]);

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
            ...($request->password ? ['password' => bcrypt($request->password)] : []),
        ]);

        return response()->json($user);
    })->middleware('auth');

    Route::delete('/api/admin/users/{user}', function (\App\Models\User $user) {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    })->middleware('auth');

    // ---- Class Management ----
    Route::get('/api/classes', [ClassRoomController::class, 'index'])->middleware('auth');
    Route::get('/api/classes/{classRoom}', [ClassRoomController::class, 'show'])->middleware('auth');
    Route::post('/api/classes', [ClassRoomController::class, 'store'])->middleware('auth');
    Route::put('/api/classes/{classRoom}', [ClassRoomController::class, 'update'])->middleware('auth');
    Route::delete('/api/classes/{classRoom}', [ClassRoomController::class, 'destroy'])->middleware('auth');
    Route::post('/api/classes/{classRoom}/enroll', [ClassRoomController::class, 'enrollStudent'])->middleware('auth');
    Route::get('/api/classes/{classRoom}/students', [ClassRoomController::class, 'students'])->middleware('auth');

    // ---- Lesson Management ----
    Route::get('/api/classes/{classRoom}/lessons', [LessonController::class, 'index'])->middleware('auth');
    Route::post('/api/classes/{classRoom}/lessons', [LessonController::class, 'store'])->middleware('auth');
    Route::get('/api/classes/{classRoom}/lessons/{lesson}', [LessonController::class, 'show'])->middleware('auth');
    Route::put('/api/classes/{classRoom}/lessons/{lesson}', [LessonController::class, 'update'])->middleware('auth');
    Route::delete('/api/classes/{classRoom}/lessons/{lesson}', [LessonController::class, 'destroy'])->middleware('auth');
    Route::post('/api/classes/{classRoom}/lessons/{lesson}/watch', [LessonController::class, 'watchVideo'])->middleware('auth');

    // ---- Homework ----
    Route::post('/api/lessons/{lesson}/homework/submit', [HomeworkController::class, 'submit'])->middleware('auth');
    Route::get('/api/lessons/{lesson}/homework/submissions', [HomeworkController::class, 'submissions'])->middleware('auth');
    Route::put('/api/homework/submissions/{submission}/review', [HomeworkController::class, 'review'])->middleware('auth');
    Route::post('/api/lessons/{lesson}/homework', [HomeworkController::class, 'store'])->middleware('auth');
    Route::put('/api/lessons/{lesson}/homework/{homework}', [HomeworkController::class, 'update'])->middleware('auth');

    // ---- Final Exam ----
    Route::get('/api/classes/{classRoom}/exam', [FinalExamController::class, 'show'])->middleware('auth');
    Route::post('/api/classes/{classRoom}/exam/submit', [FinalExamController::class, 'submit'])->middleware('auth');
    Route::post('/api/classes/{classRoom}/exam', [FinalExamController::class, 'store'])->middleware('auth');
    Route::get('/api/classes/{classRoom}/exam/submissions', [FinalExamController::class, 'submissions'])->middleware('auth');
    Route::put('/api/exam/submissions/{submission}/review', [FinalExamController::class, 'review'])->middleware('auth');

    // ---- Student Progress ----
    Route::get('/api/my-classes', [StudentProgressController::class, 'myClasses'])->middleware('auth');
    Route::get('/api/classes/{classRoom}/my-progress', [StudentProgressController::class, 'classProgress'])->middleware('auth');
    Route::get('/api/classes/{classRoom}/students-progress', [StudentProgressController::class, 'allStudentsProgress'])->middleware('auth');

    // ---- Attendance ----
    Route::post('/api/lessons/{lesson}/attendance/request', [AttendanceController::class, 'request'])->middleware('auth');
    Route::get('/api/lessons/{lesson}/attendance/status', [AttendanceController::class, 'status'])->middleware('auth');
    Route::get('/api/attendance/pending', [AttendanceController::class, 'pending'])->middleware('auth');
    Route::get('/api/lessons/{lesson}/attendance', [AttendanceController::class, 'lessonAttendance'])->middleware('auth');
    Route::put('/api/attendance/{attendance}/approve', [AttendanceController::class, 'approve'])->middleware('auth');
    Route::put('/api/attendance/{attendance}/reject', [AttendanceController::class, 'reject'])->middleware('auth');

    // ---- Student Results ----
    Route::get('/api/student/results', function () {
        $student = auth()->user();
        $homework = \App\Models\HomeworkSubmission::where('user_id', $student->id)
            ->with(['homework.lesson.classRoom'])
            ->get();
        $exams = \App\Models\FinalExamSubmission::where('user_id', $student->id)
            ->with(['question', 'finalExam.classRoom'])
            ->get();
        return response()->json([
            'homework' => $homework,
            'exams'    => $exams,
        ]);
    })->middleware('auth');

    // ---- Teacher Stats ----
    Route::get('/api/teacher/stats', function () {
        $teacher = auth()->user();
        if (!$teacher->isTeacher()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $classIds = \App\Models\ClassRoom::where('teacher_id', $teacher->id)->pluck('id');
        return response()->json([
            'pending_homework' => \App\Models\HomeworkSubmission::where('status', 'pending')
                ->whereHas('homework.lesson.classRoom', function ($q) use ($classIds) {
                    $q->whereIn('id', $classIds);
                })->count(),
            'pending_attendance' => \App\Models\AttendanceRequest::where('status', 'pending')
                ->whereHas('lesson.classRoom', function ($q) use ($classIds) {
                    $q->whereIn('id', $classIds);
                })->count(),
            'pending_exams' => \App\Models\FinalExamSubmission::where('status', 'pending')
                ->whereHas('finalExam.classRoom', function ($q) use ($classIds) {
                    $q->whereIn('id', $classIds);
                })->count(),
        ]);
    })->middleware('auth');

    // ---- Teacher Pending Lists ----
    Route::get('/api/teacher/homework/pending', function () {
        $teacher = auth()->user();
        if (!$teacher->isTeacher()) return response()->json(['message' => 'Unauthorized'], 403);
        $classIds = \App\Models\ClassRoom::where('teacher_id', $teacher->id)->pluck('id');
        return \App\Models\HomeworkSubmission::where('status', 'pending')
            ->whereHas('homework.lesson.classRoom', function ($q) use ($classIds) {
                $q->whereIn('id', $classIds);
            })
            ->with(['homework.lesson.classRoom', 'student'])
            ->orderBy('created_at', 'desc')
            ->get();
    })->middleware('auth');

    Route::get('/api/teacher/attendance/pending', function () {
        $teacher = auth()->user();
        if (!$teacher->isTeacher()) return response()->json(['message' => 'Unauthorized'], 403);
        $classIds = \App\Models\ClassRoom::where('teacher_id', $teacher->id)->pluck('id');
        return \App\Models\AttendanceRequest::where('status', 'pending')
            ->whereHas('lesson.classRoom', function ($q) use ($classIds) {
                $q->whereIn('id', $classIds);
            })
            ->with(['student', 'lesson'])
            ->orderBy('created_at', 'desc')
            ->get();
    })->middleware('auth');

    Route::get('/api/teacher/exams/pending', function () {
        $teacher = auth()->user();
        if (!$teacher->isTeacher()) return response()->json(['message' => 'Unauthorized'], 403);
        $classIds = \App\Models\ClassRoom::where('teacher_id', $teacher->id)->pluck('id');
        return \App\Models\FinalExamSubmission::where('status', 'pending')
            ->whereHas('finalExam.classRoom', function ($q) use ($classIds) {
                $q->whereIn('id', $classIds);
            })
            ->with(['student', 'question', 'finalExam'])
            ->orderBy('created_at', 'desc')
            ->get();
    })->middleware('auth');

    // ---- Notifications ----
    Route::get('/api/notifications', function () {
        $user = auth()->user();
        return response()->json([
            'unread_count' => $user->unreadNotifications->count(),
            'notifications' => $user->notifications()->latest()->take(20)->get(),
        ]);
    })->middleware('auth');

    Route::put('/api/notifications/{id}/read', function ($id) {
        $user = auth()->user();
        $notification = $user->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->markAsRead();
        }
        return response()->json(['message' => 'Marked as read']);
    })->middleware('auth');

    Route::put('/api/notifications/read-all', function () {
        $user = auth()->user();
        $user->unreadNotifications->markAsRead();
        return response()->json(['message' => 'All notifications marked as read']);
    })->middleware('auth');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
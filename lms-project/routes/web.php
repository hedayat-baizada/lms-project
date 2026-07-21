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
use App\Http\Controllers\Api\ClassRoomController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\HomeworkController;
use App\Http\Controllers\Api\FinalExamController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\StudentProgressController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ResultController;
use Illuminate\Http\Request;
use App\Http\Controllers\AnnouncementController;

use Illuminate\Support\Facades\Mail;
use App\Mail\StudentAccountCreated;
use App\Mail\StudentAccountCreatedMail;
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

    Route::get('/rejected-students', [AdminApplicationController::class, 'rejectedStudents'])
        ->name('rejected-students.index');

    Route::get('/rejected-team-applications', [TeamApplicationReviewController::class, 'rejectedTeamApplications'])
        ->name('rejected-team-applications.index');

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
        Route::get('classes/{id}/enroll', function ($id) {
            return Inertia::render('Admin/classes/enroll', ['classId' => (int) $id]);
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
        
        Route::get('classes/{id}/result', function ($id) {
            return Inertia::render('student/results/show', ['classId' => (int) $id]);
        })->name('student.result.show');
    });

    // ================================================================
    // 📢 NOTIFICATION WEB ROUTES (for your NotificationBell component)
    // ================================================================
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::get('/notifications/dropdown', [NotificationController::class, 'getDropdown']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // ==================== API Routes (Session-based) ====================

    // ---- Admin Stats (FIXED: using Spatie roles only) ----
    Route::get('/api/admin/stats', function () {
        return response()->json([
            'total_students' => \App\Models\User::role('Student')->count(),
            'total_teachers' => \App\Models\User::role('Teacher')->count(),
            'total_classes'  => \App\Models\ClassRoom::count(),
            'total_lessons'  => \App\Models\Lesson::count(),
            'total_homework_submissions' => \App\Models\HomeworkSubmission::count(),
            'pending_homework' => \App\Models\HomeworkSubmission::where('status', 'pending')->count(),
            'total_exam_submissions' => \App\Models\FinalExamSubmission::count(),
            'pending_attendance' => \App\Models\AttendanceRequest::where('status', 'pending')->count(),
            'recent_students' => \App\Models\User::role('Student')
                ->latest()->take(5)->get(['id', 'name', 'email', 'created_at']),
        ]);
    })->middleware('auth');

    // ---- Admin Lists (FIXED: using Spatie roles) ----
    Route::get('/api/admin/students', function () {
        return \App\Models\User::role('Student')->get();
    })->middleware('auth');

    Route::get('/api/admin/teachers', function () {
        return \App\Models\User::role('Teacher')->get();
    })->middleware('auth');

    // ---- Admin User Management ----
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

        $user->assignRole(ucfirst($request->role));

        if ($request->role === 'student') {

    Mail::to($user->email)
        ->send(
            new StudentAccountCreatedMail(
                $user->name,
                $user->email,
                $request->password
            )
        );
}

//         Mail::to($user->email)->send(
//     new StudentAccountCreated(
//         $user->name,
//         $user->email,
//         $request->password
//     )
// );

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
    Route::delete('/api/classes/{classRoom}/students/{student}', [ClassRoomController::class, 'removeStudent'])->middleware('auth');

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

    // ---- Student Results (existing endpoint) ----
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

    // ---- Result Routes ----
    Route::get('/api/classes/{classRoom}/results/{student}', [ResultController::class, 'show']);
    Route::get('/api/classes/{classRoom}/results', [ResultController::class, 'index']);

    // ---- Get all classes with results for a student (for My Results page) ----
    Route::get('/api/student/classes-with-results', function () {
        $student = auth()->user();
        // ✅ FIXED: use the correct relationship name (classRooms, not classes)
        $classes = $student->classRooms()->get();
        $controller = new App\Http\Controllers\ResultController();
        $results = [];
        foreach ($classes as $class) {
            $result = $controller->calculateResult($class, $student);
            $results[] = [
                'class_id' => $class->id,
                'class_name' => $class->name,
                'teacher' => $class->teacher->name ?? 'N/A',
                'final_percentage' => $result['final_percentage'],
                'grade' => $result['grade'],
                'status' => $result['status'],
                'eligible_for' => $result['eligible_for'],
            ];
        }
        return response()->json($results);
    })->middleware('auth');

    // ---- Notifications (OLD API) – now commented out, use web routes above ----
    // Route::get('/api/notifications', function () {
    //     $user = auth()->user();
    //     return response()->json([
    //         'unread_count' => $user->unreadNotifications->count(),
    //         'notifications' => $user->notifications()->latest()->take(20)->get(),
    //     ]);
    // })->middleware('auth');

    // Route::put('/api/notifications/{id}/read', function ($id) {
    //     $user = auth()->user();
    //     $notification = $user->notifications()->where('id', $id)->first();
    //     if ($notification) {
    //         $notification->markAsRead();
    //     }
    //     return response()->json(['message' => 'Marked as read']);
    // })->middleware('auth');

    // Route::put('/api/notifications/read-all', function () {
    //     $user = auth()->user();
    //     $user->unreadNotifications->markAsRead();
    //     return response()->json(['message' => 'All notifications marked as read']);
    // })->middleware('auth');

});

// ==================== Public / Apply Routes ====================
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





    ////////////////////////////

    //Announcemnets
   Route::middleware(['auth'])->group(function () {

      Route::resource('announcements', AnnouncementController::class);
    });
    Route::patch(
    '/announcements/{announcement}/pin',
    [AnnouncementController::class, 'togglePin']
)->name('announcements.pin');

Route::patch(
    '/announcements/{announcement}/status',
    [AnnouncementController::class, 'toggleStatus']
)->name('announcements.status');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
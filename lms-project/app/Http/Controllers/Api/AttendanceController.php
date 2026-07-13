<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRequest;
use App\Models\Lesson;
use App\Models\StudentLessonProgress;
use App\Services\LessonUnlockService;
use Illuminate\Http\Request;
use App\Notifications\ClassStartedNotification; // ✅ اضافه شد

class AttendanceController extends Controller
{
    public function request(Request $request, Lesson $lesson)
    {
        $student = auth()->user();

        $existing = AttendanceRequest::where([
            'user_id'   => $student->id,
            'lesson_id' => $lesson->id,
        ])->first();

        if ($existing) {
            return response()->json([
                'message' => 'Attendance already requested',
                'status'  => $existing->status,
            ], 400);
        }

        AttendanceRequest::create([
            'user_id'   => $student->id,
            'lesson_id' => $lesson->id,
            'status'    => 'pending',
        ]);

        return response()->json([
            'message' => 'Attendance request sent successfully',
            'status'  => 'pending',
        ]);
    }

    public function status(Lesson $lesson)
    {
        $student = auth()->user();

        $attendance = AttendanceRequest::where([
            'user_id'   => $student->id,
            'lesson_id' => $lesson->id,
        ])->first();

        return response()->json([
            'status' => $attendance?->status ?? 'not_requested',
        ]);
    }

    public function pending(Request $request)
    {
        $user = auth()->user();

        $query = AttendanceRequest::with(['student', 'lesson.classRoom'])->orderBy('created_at', 'desc');

        if ($user->isTeacher()) {
            $query->whereHas('lesson.classRoom', function ($q) use ($user) {
                $q->where('teacher_id', $user->id);
            });
        } elseif (!$user->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $requests = $query->get();
        return response()->json($requests);
    }

    public function lessonAttendance(Lesson $lesson)
    {
        $user = auth()->user();

        if ($user->isTeacher() && $lesson->classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized - You are not the teacher of this class'], 403);
        }

        if (!$user->isAdmin() && !$user->isTeacher()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $requests = AttendanceRequest::where('lesson_id', $lesson->id)
            ->with('student')
            ->get();

        return response()->json($requests);
    }

    public function approve(Request $request, AttendanceRequest $attendance)
    {
        $user = auth()->user();

        $classRoom = $attendance->lesson->classRoom;

        if ($user->isTeacher() && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized - You are not the teacher of this class'], 403);
        }

        if (!$user->isAdmin() && !$user->isTeacher()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $attendance->update([
            'status'       => 'approved',
            'teacher_note' => $request->teacher_note,
            'approved_at'  => now(),
        ]);

        StudentLessonProgress::updateOrCreate(
            [
                'user_id'   => $attendance->user_id,
                'lesson_id' => $attendance->lesson_id,
            ],
            [
                'video_watched'      => true,
                'video_watched_at'   => now(),
                'homework_submitted' => true,
                'is_unlocked'        => true,
            ]
        );

        $lesson  = $attendance->lesson;
        $student = $attendance->student;
        $service = new LessonUnlockService();
        $service->unlockNextLesson($student, $lesson);

        // ✅ ارسال اعلان به دانشجو
        $student->notify(new ClassStartedNotification($classRoom, $student));

        return response()->json(['message' => 'Attendance approved successfully']);
    }

    public function reject(Request $request, AttendanceRequest $attendance)
    {
        $user = auth()->user();

        $classRoom = $attendance->lesson->classRoom;

        if ($user->isTeacher() && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized - You are not the teacher of this class'], 403);
        }

        if (!$user->isAdmin() && !$user->isTeacher()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $attendance->update([
            'status'       => 'rejected',
            'teacher_note' => $request->teacher_note,
        ]);

        return response()->json(['message' => 'Attendance rejected']);
    }
}
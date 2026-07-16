<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use App\Models\StudentLessonProgress;
use Illuminate\Http\Request;

class StudentProgressController extends Controller
{
    /**
     * پیشرفت شاگرد در یک کلاس (فقط خود شاگرد)
     */
    public function classProgress(ClassRoom $classRoom)
    {
        $student = auth()->user();
        $lessons = $classRoom->lessons()->with('homework')->get();

        $progress = $lessons->map(function ($lesson) use ($student) {
            $p = StudentLessonProgress::where([
                'user_id'   => $student->id,
                'lesson_id' => $lesson->id,
            ])->first();

            return [
                'lesson_id'          => $lesson->id,
                'title'              => $lesson->title,
                'type'               => $lesson->type,
                'order'              => $lesson->order,
                'is_unlocked'        => $p?->is_unlocked ?? false,
                'video_watched'      => $p?->video_watched ?? false,
                'homework_submitted' => $p?->homework_submitted ?? false,
                'is_completed'       => ($p?->video_watched && $p?->homework_submitted) ?? false,
            ];
        });

        $totalLessons    = $lessons->count();
        $completedLessons = $progress->where('is_completed', true)->count();

        return response()->json([
            'class_room'       => $classRoom->name,
            'total_lessons'    => $totalLessons,
            'completed_lessons'=> $completedLessons,
            'percentage'       => $totalLessons > 0
                                    ? round(($completedLessons / $totalLessons) * 100)
                                    : 0,
            'lessons'          => $progress,
        ]);
    }

    /**
     * همه کلاس‌های شاگرد (فقط خود شاگرد)
     */
    public function myClasses()
    {
        $student  = auth()->user();
        $classes  = $student->classRooms()->with('lessons')->get();

        $result = $classes->map(function ($classRoom) use ($student) {
            $totalLessons = $classRoom->lessons->count();
            $completedLessons = StudentLessonProgress::where('user_id', $student->id)
                ->whereIn('lesson_id', $classRoom->lessons->pluck('id'))
                ->where('video_watched', true)
                ->where('homework_submitted', true)
                ->count();

            return [
                'id'               => $classRoom->id,
                'name'             => $classRoom->name,
                'type'             => $classRoom->type,
                'total_lessons'    => $totalLessons,
                'completed_lessons'=> $completedLessons,
                'percentage'       => $totalLessons > 0
                                        ? round(($completedLessons / $totalLessons) * 100)
                                        : 0,
                'status'           => $classRoom->pivot->status,
            ];
        });

        return response()->json($result);
    }

    /**
     * پیشرفت همه شاگردان یک کلاس (فقط معلم آن کلاس یا ادمین)
     */
    public function allStudentsProgress(ClassRoom $classRoom)
    {
        $user = auth()->user();

        // بررسی دسترسی: فقط ادمین یا معلم خود کلاس
        if ($user->isTeacher() && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized - You are not the teacher of this class'], 403);
        }

        if (!$user->isAdmin() && !$user->isTeacher()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $students = $classRoom->students()->get();
        $lessons  = $classRoom->lessons()->pluck('id');

        $result = $students->map(function ($student) use ($classRoom, $lessons) {
            $completedLessons = StudentLessonProgress::where('user_id', $student->id)
                ->whereIn('lesson_id', $lessons)
                ->where('video_watched', true)
                ->where('homework_submitted', true)
                ->count();

            return [
                'student_id'       => $student->id,
                'student_name'     => $student->name,
                'completed_lessons'=> $completedLessons,
                'total_lessons'    => $lessons->count(),
                'percentage'       => $lessons->count() > 0
                                        ? round(($completedLessons / $lessons->count()) * 100)
                                        : 0,
            ];
        });

        return response()->json($result);
    }
}
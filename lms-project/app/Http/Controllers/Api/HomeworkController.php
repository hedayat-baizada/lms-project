<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Homework;
use App\Models\HomeworkSubmission;
use App\Models\Lesson;
use App\Models\StudentLessonProgress;
use App\Services\LessonUnlockService;
use Illuminate\Http\Request;
use App\Notifications\HomeworkReviewedNotification;

class HomeworkController extends Controller
{
    public function submit(Request $request, Lesson $lesson)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('homework.submit')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'answer' => 'required|string',
        ]);

        $student  = auth()->user();
        $homework = $lesson->homework;

        if (!$homework) {
            return response()->json(['message' => 'No homework for this lesson'], 404);
        }

        $existing = HomeworkSubmission::where([
            'homework_id' => $homework->id,
            'user_id'     => $student->id,
        ])->first();

        if ($existing) {
            return response()->json(['message' => 'Homework already submitted'], 400);
        }

        HomeworkSubmission::create([
            'homework_id' => $homework->id,
            'user_id'     => $student->id,
            'answer'      => $request->answer,
            'status'      => 'pending',
        ]);

        $progress = StudentLessonProgress::where([
            'user_id'   => $student->id,
            'lesson_id' => $lesson->id,
        ])->first();

        if ($progress) {
            $progress->update(['homework_submitted' => true]);
        }

        $service = new LessonUnlockService();
        $service->unlockNextLesson($student, $lesson);

        return response()->json(['message' => 'Homework submitted successfully']);
    }

    public function submissions(Lesson $lesson)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('homework.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->hasRole('teacher')) {
            $classRoom = $lesson->classRoom;
            if ($classRoom->teacher_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized - This lesson does not belong to your class'], 403);
            }
        } elseif (!$user->hasRole('admin')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $homework = $lesson->homework;
        if (!$homework) {
            return response()->json(['message' => 'No homework for this lesson'], 404);
        }

        $submissions = HomeworkSubmission::where('homework_id', $homework->id)
            ->with('student')
            ->get();

        return response()->json($submissions);
    }

    public function review(Request $request, HomeworkSubmission $submission)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('homework.review')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $homework = $submission->homework;
        $lesson = $homework->lesson;
        $classRoom = $lesson->classRoom;

        if ($user->hasRole('teacher') && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized - You are not the teacher of this class'], 403);
        }

        if (!$user->hasRole('admin') && !$user->hasRole('teacher')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'score'            => 'required|integer|min:0|max:100',
            'teacher_feedback' => 'nullable|string',
        ]);

        $submission->update([
            'score'            => $request->score,
            'teacher_feedback' => $request->teacher_feedback,
            'status'           => 'reviewed',
        ]);

        $student = $submission->student;
        $student->notify(new HomeworkReviewedNotification($submission));

        return response()->json(['message' => 'Homework reviewed successfully']);
    }

    public function store(Request $request, Lesson $lesson)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('homework.create')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $classRoom = $lesson->classRoom;

        if ($user->hasRole('teacher') && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized - You are not the teacher of this class'], 403);
        }

        if (!$user->hasRole('admin') && !$user->hasRole('teacher')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'title'    => 'required|string',
            'question' => 'required|string',
        ]);

        if ($lesson->homework) {
            return response()->json(['message' => 'This lesson already has homework. Use update instead.'], 409);
        }

        $homework = Homework::create([
            'lesson_id' => $lesson->id,
            'title'     => $request->title,
            'question'  => $request->question,
        ]);

        return response()->json($homework, 201);
    }

    public function update(Request $request, Lesson $lesson, Homework $homework)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('homework.edit')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $classRoom = $lesson->classRoom;

        if ($user->hasRole('teacher') && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized - You are not the teacher of this class'], 403);
        }

        if (!$user->hasRole('admin') && !$user->hasRole('teacher')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($homework->lesson_id !== $lesson->id) {
            return response()->json(['message' => 'Homework does not belong to this lesson'], 400);
        }

        $request->validate([
            'title'    => 'sometimes|string',
            'question' => 'sometimes|string',
        ]);

        $homework->update($request->all());
        return response()->json($homework);
    }
}
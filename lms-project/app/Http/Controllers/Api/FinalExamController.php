<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use App\Models\FinalExam;
use App\Models\FinalExamQuestion;
use App\Models\FinalExamSubmission;
use App\Models\StudentLessonProgress;
use Illuminate\Http\Request;
use App\Notifications\ExamGradedNotification; // ✅ اضافه شد

class FinalExamController extends Controller
{
    public function show(ClassRoom $classRoom)
    {
        $student = auth()->user();

        $totalLessons = $classRoom->lessons()->count();
        $completedLessons = StudentLessonProgress::where('user_id', $student->id)
            ->whereIn('lesson_id', $classRoom->lessons()->pluck('id'))
            ->where('video_watched', true)
            ->where('homework_submitted', true)
            ->count();

        if ($totalLessons !== $completedLessons) {
            return response()->json([
                'message' => 'You must complete all lessons first'
            ], 403);
        }

        $exam = FinalExam::where('class_room_id', $classRoom->id)
            ->with('questions')
            ->first();

        if (!$exam) {
            return response()->json(['message' => 'No exam found'], 404);
        }

        return response()->json($exam);
    }

    public function submit(Request $request, ClassRoom $classRoom)
    {
        $request->validate([
            'answers'                => 'required|array',
            'answers.*.question_id'  => 'required|exists:final_exam_questions,id',
            'answers.*.answer'       => 'required|string',
        ]);

        $student = auth()->user();
        $exam    = FinalExam::where('class_room_id', $classRoom->id)->first();

        if (!$exam) {
            return response()->json(['message' => 'No exam found'], 404);
        }

        $existing = FinalExamSubmission::where([
            'final_exam_id' => $exam->id,
            'user_id'       => $student->id,
        ])->first();

        if ($existing) {
            return response()->json(['message' => 'Exam already submitted'], 400);
        }

        foreach ($request->answers as $answer) {
            FinalExamSubmission::create([
                'final_exam_id'          => $exam->id,
                'user_id'                => $student->id,
                'final_exam_question_id' => $answer['question_id'],
                'answer'                 => $answer['answer'],
                'status'                 => 'pending',
            ]);
        }

        return response()->json(['message' => 'Exam submitted successfully']);
    }

    public function store(Request $request, ClassRoom $classRoom)
    {
        $request->validate([
            'title'       => 'required|string',
            'description' => 'nullable|string',
            'total_score' => 'integer',
            'questions'   => 'required|array',
            'questions.*.question' => 'required|string',
            'questions.*.order'    => 'required|integer',
        ]);

        $exam = FinalExam::create([
            'class_room_id' => $classRoom->id,
            'title'         => $request->title,
            'description'   => $request->description,
            'total_score'   => $request->total_score ?? 100,
        ]);

        foreach ($request->questions as $question) {
            FinalExamQuestion::create([
                'final_exam_id' => $exam->id,
                'question'      => $question['question'],
                'order'         => $question['order'],
            ]);
        }

        return response()->json($exam->load('questions'), 201);
    }

    public function review(Request $request, FinalExamSubmission $submission)
    {
        $user = auth()->user();

        $exam = $submission->finalExam;
        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        $classRoom = $exam->classRoom;
        if (!$classRoom) {
            return response()->json(['message' => 'Class not found'], 404);
        }

        if ($user->isTeacher() && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized - You are not the teacher of this class'], 403);
        }

        if (!$user->isAdmin() && !$user->isTeacher()) {
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

        // ✅ ارسال اعلان به دانشجو
        $student = $submission->student;
        $student->notify(new ExamGradedNotification($submission));

        return response()->json(['message' => 'Submission reviewed successfully']);
    }

    public function submissions(ClassRoom $classRoom)
    {
        $user = auth()->user();

        if ($user->isTeacher() && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized - You are not the teacher of this class'], 403);
        }

        if (!$user->isAdmin() && !$user->isTeacher()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $exam = FinalExam::where('class_room_id', $classRoom->id)->first();

        if (!$exam) {
            return response()->json(['message' => 'No exam found'], 404);
        }

        $submissions = FinalExamSubmission::where('final_exam_id', $exam->id)
            ->with(['student', 'question'])
            ->get()
            ->groupBy('user_id');

        return response()->json($submissions);
    }
}
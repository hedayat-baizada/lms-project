<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\ClassRoom;
use App\Models\StudentLessonProgress;
use App\Services\LessonUnlockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Notifications\LessonReleasedNotification; // ✅ اضافه شد

class LessonController extends Controller
{
    public function index(ClassRoom $classRoom)
    {
        $user = auth()->user();
        $lessons = $classRoom->lessons()->with('homework')->get();

        if (!$user || $user->role === 'admin' || $user->role === 'teacher') {
            return response()->json($lessons);
        }

        if ($classRoom->hasEnded()) {
            return response()->json([
                'message' => 'This class has ended.',
                'lessons' => []
            ], 403);
        }

        if (!$classRoom->hasStarted()) {
            return response()->json([
                'message' => 'This class has not started yet.',
                'lessons' => []
            ], 403);
        }

        $filteredLessons = $lessons->filter(function ($lesson) {
            return $lesson->isReleased();
        })->values();

        $filteredLessons->map(function ($lesson) use ($user) {
            $progress = StudentLessonProgress::where([
                'user_id'   => $user->id,
                'lesson_id' => $lesson->id,
            ])->first();

            $lesson->is_unlocked        = $progress?->is_unlocked ?? false;
            $lesson->video_watched      = $progress?->video_watched ?? false;
            $lesson->homework_submitted = $progress?->homework_submitted ?? false;
            $lesson->isReleased         = true;

            return $lesson;
        });

        return response()->json($filteredLessons);
    }

    public function show(ClassRoom $classRoom, Lesson $lesson)
    {
        $user = auth()->user();

        if ($user->role === 'admin' || $user->role === 'teacher') {
            $lesson->load('homework');
            return response()->json($lesson);
        }

        if ($classRoom->hasEnded()) {
            return response()->json(['message' => 'This class has ended.'], 403);
        }

        if (!$classRoom->hasStarted()) {
            return response()->json(['message' => 'This class has not started yet.'], 403);
        }

        if (!$lesson->isReleased()) {
            return response()->json(['message' => 'This lesson is not released yet.'], 403);
        }

        $progress = StudentLessonProgress::where([
            'user_id'   => $user->id,
            'lesson_id' => $lesson->id,
        ])->first();

        if (!$progress || !$progress->is_unlocked) {
            return response()->json(['message' => 'This lesson is locked'], 403);
        }

        $lesson->load('homework');
        $lesson->is_unlocked        = $progress->is_unlocked;
        $lesson->video_watched      = $progress->video_watched;
        $lesson->homework_submitted = $progress->homework_submitted;
        $lesson->isReleased         = true;

        return response()->json($lesson);
    }

    public function watchVideo(ClassRoom $classRoom, Lesson $lesson)
    {
        $student = auth()->user();

        if ($classRoom->hasEnded()) {
            return response()->json(['message' => 'This class has ended.'], 403);
        }

        if (!$classRoom->hasStarted()) {
            return response()->json(['message' => 'This class has not started yet.'], 403);
        }

        if (!$lesson->isReleased()) {
            return response()->json(['message' => 'This lesson is not released yet.'], 403);
        }

        $progress = StudentLessonProgress::where([
            'user_id'   => $student->id,
            'lesson_id' => $lesson->id,
        ])->first();

        if (!$progress || !$progress->is_unlocked) {
            return response()->json(['message' => 'This lesson is locked'], 403);
        }

        $progress->update([
            'video_watched'    => true,
            'video_watched_at' => now(),
        ]);

        $service = new LessonUnlockService();
        $service->unlockNextLesson($student, $lesson);

        return response()->json(['message' => 'Video marked as watched']);
    }

    public function store(Request $request, ClassRoom $classRoom)
    {
        $request->validate([
            'title'        => 'required|string',
            'type'         => 'required|in:video,online_meet',
            'video_path'   => 'nullable|string',
            'video_url'    => 'nullable|string',
            'meet_link'    => 'nullable|string',
            'description'  => 'nullable|string',
            'order'        => 'required|integer',
            'release_date' => 'nullable|date',
            'video_file'   => 'nullable|file|mimes:mp4,avi,mov,mkv|max:20480',
        ]);

        $data = $request->only(['title', 'type', 'video_url', 'meet_link', 'description', 'order', 'release_date']);

        if ($request->hasFile('video_file')) {
            $path = $request->file('video_file')->store('videos', 'public');
            $data['video_path'] = $path;
        } else {
            if ($request->has('video_path')) {
                $data['video_path'] = $request->video_path;
            }
        }

        $lesson = $classRoom->lessons()->create($data);

        // ✅ ارسال اعلان به همه دانشجویان کلاس اگر درس منتشر شده باشد
        if ($lesson->isReleased()) {
            $students = $classRoom->students;
            foreach ($students as $student) {
                $student->notify(new LessonReleasedNotification($lesson, $student));
            }
        }

        return response()->json($lesson, 201);
    }

    public function update(Request $request, ClassRoom $classRoom, Lesson $lesson)
    {
        $request->validate([
            'title'        => 'sometimes|string',
            'type'         => 'sometimes|in:video,online_meet',
            'video_path'   => 'nullable|string',
            'video_url'    => 'nullable|string',
            'meet_link'    => 'nullable|string',
            'description'  => 'nullable|string',
            'order'        => 'sometimes|integer',
            'release_date' => 'nullable|date',
            'video_file'   => 'nullable|file|mimes:mp4,avi,mov,mkv|max:20480',
        ]);

        $data = $request->only(['title', 'type', 'video_url', 'meet_link', 'description', 'order', 'release_date']);

        if ($request->hasFile('video_file')) {
            if ($lesson->video_path && Storage::disk('public')->exists($lesson->video_path)) {
                Storage::disk('public')->delete($lesson->video_path);
            }
            $path = $request->file('video_file')->store('videos', 'public');
            $data['video_path'] = $path;
        } elseif ($request->has('video_path')) {
            $data['video_path'] = $request->video_path;
        }

        $lesson->update($data);
        return response()->json($lesson);
    }

    public function destroy(ClassRoom $classRoom, Lesson $lesson)
    {
        if ($lesson->video_path && Storage::disk('public')->exists($lesson->video_path)) {
            Storage::disk('public')->delete($lesson->video_path);
        }

        $lesson->delete();
        return response()->json(['message' => 'Lesson deleted successfully']);
    }
}
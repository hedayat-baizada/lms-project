<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use App\Models\User;
use App\Services\LessonUnlockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassRoomController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->hasPermissionTo('classes.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->hasRole('teacher')) {
            $classRooms = ClassRoom::with('teacher')
                ->where('teacher_id', $user->id)
                ->where('is_active', true)
                ->get();
        } elseif ($user->hasRole('student')) {
            $classRooms = ClassRoom::whereHas('students', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->with('teacher')->where('is_active', true)->get();
        } else {
            $classRooms = ClassRoom::with('teacher')
                ->where('is_active', true)
                ->get();
        }

        $classRooms->each(function ($class) {
            $class->is_active_now = $class->isActiveNow();
            $class->has_started = $class->hasStarted();
            $class->has_ended = $class->hasEnded();
            $class->start_date_formatted = $class->start_date?->format('Y-m-d');
            $class->end_date_formatted = $class->end_date?->format('Y-m-d');
        });

        return response()->json($classRooms);
    }

    public function show(ClassRoom $classRoom)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('classes.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->hasRole('teacher') && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $classRoom->load(['teacher', 'lessons', 'students' => function ($q) {
            $q->wherePivot('status', 'active');
        }]);

        $classRoom->is_active_now = $classRoom->isActiveNow();
        $classRoom->has_started = $classRoom->hasStarted();
        $classRoom->has_ended = $classRoom->hasEnded();
        $classRoom->start_date_formatted = $classRoom->start_date?->format('Y-m-d');
        $classRoom->end_date_formatted = $classRoom->end_date?->format('Y-m-d');

        return response()->json($classRoom);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('classes.create')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name'        => 'required|string|max:255',
            'type'        => 'required|in:english,computer',
            'level'       => 'nullable|in:prep_cel,cel',
            'has_video'   => 'boolean',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
            'teacher_id'  => 'required|exists:users,id|in:' . implode(',', User::where('role', 'teacher')->pluck('id')->toArray()),
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
        ]);

        $classRoom = ClassRoom::create($request->all());

        return response()->json($classRoom, 201);
    }

    public function update(Request $request, ClassRoom $classRoom)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('classes.edit')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'type'        => 'sometimes|in:english,computer',
            'level'       => 'nullable|in:prep_cel,cel',
            'has_video'   => 'boolean',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
            'teacher_id'  => 'sometimes|exists:users,id|in:' . implode(',', User::where('role', 'teacher')->pluck('id')->toArray()),
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
        ]);

        $classRoom->update($request->all());

        return response()->json($classRoom);
    }

    public function destroy(ClassRoom $classRoom)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('classes.delete')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $classRoom->delete();
        return response()->json(['message' => 'Class deleted successfully']);
    }

    public function enrollStudent(Request $request, ClassRoom $classRoom)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('enrollments.create')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($classRoom->hasEnded()) {
            return response()->json(['message' => 'This class has ended. Enrollment is closed.'], 400);
        }

        $request->validate([
            'student_id' => 'required|exists:users,id|in:' . implode(',', User::where('role', 'student')->pluck('id')->toArray()),
            'teacher_id' => 'sometimes|exists:users,id',
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date|after:start_date',
        ]);

        $studentId = $request->student_id;
        $teacherId = $request->teacher_id ?? $classRoom->teacher_id;

        if ($request->has('teacher_id') && is_null($classRoom->teacher_id)) {
            $classRoom->update(['teacher_id' => $request->teacher_id]);
            $teacherId = $request->teacher_id;
        }

        if (!$teacherId) {
            return response()->json(['message' => 'No teacher assigned to this class'], 400);
        }

        $existing = $classRoom->students()->where('user_id', $studentId)->first();

        if ($existing) {
            \App\Models\StudentLessonProgress::where('user_id', $studentId)
                ->whereIn('lesson_id', $classRoom->lessons()->pluck('id'))
                ->delete();

            $classRoom->students()->updateExistingPivot($studentId, [
                'teacher_id' => $teacherId,
                'start_date' => $request->start_date,
                'end_date'   => $request->end_date,
                'status'     => 'active',
            ]);

            $student = User::find($studentId);
            $service = new LessonUnlockService();
            $service->initializeFirstLesson($student, $classRoom->id);

            return response()->json(['message' => 'Student re-enrolled and progress reset successfully']);
        }

        $classRoom->students()->attach($studentId, [
            'teacher_id' => $teacherId,
            'start_date' => $request->start_date,
            'end_date'   => $request->end_date,
            'status'     => 'active',
        ]);

        $student = User::find($studentId);
        $service = new LessonUnlockService();
        $service->initializeFirstLesson($student, $classRoom->id);

        return response()->json(['message' => 'Student enrolled successfully']);
    }

    public function students(ClassRoom $classRoom)
    {
        $user = auth()->user();

        if (!$user->hasPermissionTo('students.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->hasRole('teacher') && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$user->hasRole('admin') && !$user->hasRole('teacher')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $students = $classRoom->students()
            ->wherePivot('status', 'active')
            ->get(['users.id', 'users.name', 'users.email']);

        return response()->json($students);
    }
}
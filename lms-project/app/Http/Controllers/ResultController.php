<?php

namespace App\Http\Controllers;

use App\Models\ClassRoom;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResultController extends Controller
{
    /**
     * Get result for a specific student (for students themselves)
     */
    public function show(ClassRoom $classRoom, User $student)
    {
        $user = Auth::user();

        // Permission check: Only the student themselves, teacher of the class, or admin
        if ($user->id !== $student->id && !$user->hasRole(['Super Admin', 'Admin']) && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if student is actually enrolled in this class
        if (!$classRoom->students()->where('user_id', $student->id)->exists()) {
            return response()->json(['message' => 'Student not enrolled in this class'], 404);
        }

        return response()->json($this->calculateResult($classRoom, $student));
    }

    /**
     * Get results for all students in a class (for teachers or admins)
     */
    public function index(ClassRoom $classRoom)
    {
        $user = Auth::user();

        if (!$user->hasRole(['Super Admin', 'Admin']) && $classRoom->teacher_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $students = $classRoom->students()->get();
        $results = [];
        foreach ($students as $student) {
            $results[] = $this->calculateResult($classRoom, $student);
        }

        return response()->json($results);
    }

    /**
     * Main calculation logic for a single student's result
     * 
     * Made public so it can be called from routes (e.g., /api/student/classes-with-results)
     */
    public function calculateResult(ClassRoom $classRoom, User $student)
    {
        // 1. Get all lessons for this class
        $lessons = $classRoom->lessons;

        // 2. Calculate attendance (FIXED: use user_id instead of student_id)
        $totalLessons = $lessons->count();
        $attendedLessons = \App\Models\AttendanceRequest::where('user_id', $student->id)
            ->whereHas('lesson', function ($q) use ($classRoom) {
                $q->where('class_room_id', $classRoom->id);
            })
            ->where('status', 'approved')
            ->count();

        $attendancePercentage = $totalLessons > 0 ? round(($attendedLessons / $totalLessons) * 100, 2) : 0;

        // 3. Get homework scores
        $totalHomeworkScore = 0;
        $totalHomeworkMax = 0;

        $submissions = \App\Models\HomeworkSubmission::where('user_id', $student->id)
            ->whereHas('homework.lesson', function ($q) use ($classRoom) {
                $q->where('class_room_id', $classRoom->id);
            })
            ->whereNotNull('score')
            ->with('homework')
            ->get();

        foreach ($submissions as $submission) {
            $totalHomeworkScore += $submission->score;
            $totalHomeworkMax += $submission->homework->total_score ?? 100;
        }

        $homeworkPercentage = $totalHomeworkMax > 0 ? round(($totalHomeworkScore / $totalHomeworkMax) * 100, 2) : 0;

        // 4. Get final exam score
        $examSubmission = \App\Models\FinalExamSubmission::where('user_id', $student->id)
            ->whereHas('finalExam', function ($q) use ($classRoom) {
                $q->where('class_room_id', $classRoom->id);
            })
            ->whereNotNull('score')
            ->first();

        $examScore = $examSubmission ? $examSubmission->score : null;
        $examTotal = $examSubmission ? ($examSubmission->question->points ?? 100) : 100;
        $examPercentage = $examScore ? round(($examScore / $examTotal) * 100, 2) : 0;

        // 5. Calculate final percentage (Weighted: 40% homework, 50% exam, 10% attendance)
        $finalPercentage = 0;
        if ($homeworkPercentage > 0 && $examScore !== null) {
            $finalPercentage = ($homeworkPercentage * 0.4) + ($examPercentage * 0.5) + ($attendancePercentage * 0.1);
        } elseif ($examScore !== null) {
            $finalPercentage = ($examPercentage * 0.9) + ($attendancePercentage * 0.1);
        } elseif ($homeworkPercentage > 0) {
            $finalPercentage = ($homeworkPercentage * 0.9) + ($attendancePercentage * 0.1);
        }
        $finalPercentage = round($finalPercentage, 2);

        // 6. Determine Grade
        $grade = $this->getGrade($finalPercentage);
        $status = $finalPercentage >= 60 ? 'Passed' : 'Failed';

        // 7. Determine next class (Eligible for)
        $eligibleFor = $this->getEligibleClass($classRoom->name, $finalPercentage);

        return [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'father_name' => $student->father_name ?? 'N/A',
            ],
            'class' => [
                'id' => $classRoom->id,
                'name' => $classRoom->name,
                'teacher' => $classRoom->teacher->name ?? 'N/A',
            ],
            'class_incharge' => $classRoom->teacher->name ?? 'Ms. Savita Rahiab',
            'program_manager' => 'Ms. Orozgani',
            'co_founder' => 'Ms. Danish',
            'eligible_for' => $eligibleFor,
            'awarded_on' => now()->format('F d, Y'),
            'attendance' => [
                'present' => $attendedLessons,
                'total' => $totalLessons,
                'percentage' => $attendancePercentage,
            ],
            'final_percentage' => $finalPercentage,
            'grade' => $grade,
            'status' => $status,
        ];
    }

    private function getGrade($percentage)
    {
        if ($percentage >= 90) return 'A+';
        if ($percentage >= 80) return 'A';
        if ($percentage >= 70) return 'B';
        if ($percentage >= 60) return 'C';
        return 'F';
    }

    private function getEligibleClass($currentClass, $percentage)
    {
        if ($percentage >= 90) return 'Advanced Level';
        if ($percentage >= 75) return 'Intermediate Level';
        if ($percentage >= 60) return 'Pre-Intermediate Level';
        if ($percentage >= 50) return 'Elementary Level';
        return $currentClass;
    }
}
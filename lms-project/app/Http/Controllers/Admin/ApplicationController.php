<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Http\Request;

use App\Models\PlacementLevel;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Inertia\Inertia;
use App\Models\ReviewAction;
use App\Models\CorrectionRequest;
use App\Models\ApplicationStatusLog;

class ApplicationController extends Controller
{

public function rejectedStudents()
{
    $students = Application::where('status', 'rejected')
        ->latest('updated_at')
        ->get([
            'id',
            'full_name',
            'email',
            'tracking_code',
            'course_track',
            'updated_at',
        ]);

    return Inertia::render(
        'Admin/Applications/RejectedStudents',
        [
            'students' => $students,
        ]
    );
}


public function approvedApplicants()
{
    $applications = Application::with('placementTest')
        ->where('status', 'approved')
        ->latest('reviewed_at')
        ->get();

    return Inertia::render('Admin/ApprovedApplicants/Index', [
        'applications' => $applications,
    ]);
}

public function showApprovedApplicant(Application $application)
{
    abort_unless($application->status === 'approved', 404);

    $application->load([
        'documents',
        'guardianInfo',
        'placementTest',
        'speakingTest',
    ]);

    return Inertia::render('Admin/ApprovedApplicants/Show', [
        'application' => [
            ...$application->toArray(),
            'documents' => $application->documents->map(function ($document) {
                return [
                    ...$document->toArray(),
                    'file_url' => asset('storage/' . $document->file_path),
                ];
            }),
        ],
    ]);
}  



public function history(Application $application)
{
    $application->load([
        'statusLogs',
        'correctionRequests',
        'reviewActions',
    ]);

    return Inertia::render('Admin/Applications/History', [
        'application' => $application,
    ]);
}




public function approve(Application $application)
{
    if (! $application->placementTest?->placement_level) {
        return back()->with('error', 'Please select and save a placement level before approving.');
    }

    $oldStatus = $application->status;

    $application->update([
        'status' => 'approved',
        'reviewer_notes' => $application->placementTest->reviewer_notes,
        'reviewed_at' => now(),
        'reviewed_by' => auth()->id(),
    ]);

    ReviewAction::create([
        'application_id' => $application->id,
        'reviewer_id' => auth()->id(),
        'action' => 'approved',
        'notes' => 'Application approved with placement level: ' . $application->placementTest->placement_level,
    ]);

    ApplicationStatusLog::create([
        'application_id' => $application->id,
        'old_status' => $oldStatus,
        'new_status' => 'approved',
        'changed_by' => auth()->id(),
        'notes' => 'Approved with placement level: ' . $application->placementTest->placement_level,
    ]);

    return back()->with('success', 'Application approved successfully.');
}






public function speakingReview(Application $application)
{
    $application->load([
        'speakingTest',
        'placementTest',
    ]);

    $speakingPrompt = null;

    if ($application->placementTest) {
        $speakingPrompt = \App\Models\PlacementQuestion::where('test_code', $application->placementTest->test_code)
            ->where('section', 'speaking')
            ->where('status', 'active')
            ->first();
    }

    return Inertia::render('Admin/Applications/SpeakingReview', [
        'application' => [
            ...$application->toArray(),
            'speaking_test' => $application->speakingTest
                ? [
                    ...$application->speakingTest->toArray(),
                    'audio_url' => $application->speakingTest->audio_path
                        ? asset('storage/' . $application->speakingTest->audio_path)
                        : null,
                ]
                : null,
        ],
        'speakingPrompt' => $speakingPrompt,
    ]);
}



public function writingReview(Application $application)
{
    $application->load([
        'placementTest',
    ]);

    $writingPrompt = null;

    if ($application->placementTest) {
        $writingPrompt = \App\Models\PlacementQuestion::where('test_code', $application->placementTest->test_code)
            ->where('section', 'writing')
            ->where('status', 'active')
            ->first();
    }

    return Inertia::render('Admin/Applications/WritingReview', [
        'application' => $application,
        'writingPrompt' => $writingPrompt,
    ]);
}


public function placementTest(Application $application)
{
    $application->load([
        'placementTest.answers.question',
    ]);

    return Inertia::render('Admin/Applications/PlacementTest', [
        'application' => $application,
    ]);
}


        public function reject(Application $application)
{
    request()->validate([
        'notes' => 'required|string',
    ]);

    $oldStatus = $application->status;

    $application->update([
        'status' => 'rejected',
        'reviewer_notes' => request('notes'),
        'reviewed_at' => now(),
        'reviewed_by' => auth()->id(),
    ]);

    ReviewAction::create([
        'application_id' => $application->id,
        'reviewer_id' => auth()->id(),
        'action' => 'rejected',
        'notes' => request('notes'),
    ]);

    ApplicationStatusLog::create([
        'application_id' => $application->id,
        'old_status' => $oldStatus,
        'new_status' => 'rejected',
        'changed_by' => auth()->id(),
        'notes' => request('notes'),
    ]);

    return back()->with('error', 'Application rejected.');
}

public function requestCorrection(Application $application)
{
    request()->validate([
        'message' => 'required|string',
    ]);

    $oldStatus = $application->status;

    $application->update([
        'status' => 'need_correction',
        'reviewer_notes' => request('message'),
        'reviewed_at' => now(),
        'reviewed_by' => auth()->id(),
    ]);

    CorrectionRequest::create([
        'application_id' => $application->id,
        'requested_by' => auth()->id(),
        'message' => request('message'),
        'status' => 'open',
    ]);

    ReviewAction::create([
        'application_id' => $application->id,
        'reviewer_id' => auth()->id(),
        'action' => 'need_correction',
        'notes' => request('message'),
    ]);

    ApplicationStatusLog::create([
        'application_id' => $application->id,
        'old_status' => $oldStatus,
        'new_status' => 'need_correction',
        'changed_by' => auth()->id(),
        'notes' => request('message'),
    ]);

    return back()->with('success', 'Correction request sent successfully.');
}



public function index(Request $request)
{
    $query = Application::query();

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if ($request->filled('search')) {
        $search = $request->search;

        $query->where(function ($q) use ($search) {
            $q->where('tracking_code', 'like', "%{$search}%")
                ->orWhere('full_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Status Filter
    |--------------------------------------------------------------------------
    */

    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    /*
    |--------------------------------------------------------------------------
    | Course Filter
    |--------------------------------------------------------------------------
    */

    if ($request->filled('course')) {
        $query->where('course_track', $request->course);
    }

    $applications = $query
        ->latest()
        ->select([
            'id',
            'tracking_code',
            'full_name',
            'email',
            'phone',
            'course_category',
            'course_track',
            'selected_computer_topic',
            'status',
            'created_at',
        ])
        ->get();


        $stats = [
    'total' => Application::count(),
    'waiting_review' => Application::where('status', 'waiting_review')->count(),
    'approved' => Application::where('status', 'approved')->count(),
    'rejected' => Application::where('status', 'rejected')->count(),
    'need_correction' => Application::where('status', 'need_correction')->count(),
];



    return Inertia::render('Admin/Applications/Index', [
    'applications' => $applications,
    'filters' => [
        'search' => $request->search,
        'status' => $request->status,
        'course' => $request->course,
    ],
    'stats' => $stats,
]);
}


    public function score(Application $application)
{
    request()->validate([
        'written_score' => 'nullable|integer|min:0',
        'speaking_score' => 'nullable|integer|min:0',
        'reviewer_notes' => 'nullable|string',
        'placement_level' => 'nullable|string|max:255',
    ]);

    if (! $application->placementTest) {
        return back()->with('message', 'No placement test found.');
    }

    $application->placementTest->update([
        'written_score' => request('written_score'),
        'speaking_score' => request('speaking_score'),
        'total_score' => (int) request('written_score') + (int) request('speaking_score'),
        'placement_level' => request('placement_level'),
        'reviewer_notes' => request('reviewer_notes'),
    ]);

   return back()->with('success', 'Evaluation saved successfully.');
}
   





public function review(Application $application)
{
    $application->load([
        'documents',
        'guardianInfo',
        'placementTest',
    ]);

    return Inertia::render('Apply/Review', [
        'application' => $application,
    ]);
}

public function submitFinal(Application $application)
{
    $application->update([
        'status' => 'waiting_review',
        'submitted_at' => now(),
    ]);

    return redirect()
        ->route('apply.track')
        ->with('message', 'Your application has been submitted and is waiting for review.');
}




    public function show(Application $application)
{
    $application->load([
        'documents',
        'guardianInfo',
        'placementTest.testQuestions.placementQuestion',
        'placementTest.answers.question',
        'speakingTest',
        'correctionRequests',
        'reviewActions',
        'statusLogs',
        'placementTest',
    ]);

   


    $program = $application->course_track === 'cel'
    ? 'cel'
    : 'prep_cel';



$placementLevels = PlacementLevel::where('program', $program)
    ->where('active', true)
    ->orderBy('display_order')
    ->get();

    $placementTest = $application->placementTest;

$totalQuestions = $placementTest
    ? $placementTest->testQuestions()->count()
    : 0;

$answers = $placementTest
    ? $placementTest->answers
    : collect();

$correct = $answers->where('score', 1)->count();

$wrong = max($totalQuestions - $correct, 0);

$placementSummary = [
    'total' => $totalQuestions,
    'correct' => $correct,
    'wrong' => $wrong,
    'score' => $correct,
];


    
   return Inertia::render('Admin/Applications/Show', [
    'application' => [
        ...$application->toArray(),
        'documents' => $application->documents->map(function ($document) {
            return [
                ...$document->toArray(),
                'file_url' => asset('storage/' . $document->file_path),
            ];
        }),
    ],
    'placementSummary' => $placementSummary,
        'placementLevels' => $placementLevels,

]);





}
}
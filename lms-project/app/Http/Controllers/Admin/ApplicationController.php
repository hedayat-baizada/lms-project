<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Inertia\Inertia;
use App\Models\ReviewAction;
use App\Models\CorrectionRequest;
use App\Models\ApplicationStatusLog;

class ApplicationController extends Controller
{


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

    return back()->with('message', 'Application rejected.');
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

    return back()->with('message', 'Correction requested.');
}



public function index()
    {
        $applications = Application::latest()
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

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
        ]);
    }



    public function score(Application $application)
{
    request()->validate([
        'written_score' => 'nullable|integer|min:0',
        'speaking_score' => 'nullable|integer|min:0',
        'reviewer_notes' => 'nullable|string',
    ]);

    if (! $application->placementTest) {
        return back()->with('message', 'No placement test found.');
    }

    $application->placementTest->update([
        'written_score' => request('written_score'),
        'speaking_score' => request('speaking_score'),
        'total_score' => (int) request('written_score') + (int) request('speaking_score'),
        'reviewer_notes' => request('reviewer_notes'),
    ]);

    return back()->with('message', 'Scores saved successfully.');
}
   





    public function show(Application $application)
{
    $application->load([
        'documents',
        'guardianInfo',
        'placementTest.testQuestions.placementQuestion',
        'placementTest.answers',
        'correctionRequests',
        'reviewActions',
        'statusLogs',
    ]);

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
    ]);
}
}
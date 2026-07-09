<?php

namespace App\Http\Controllers;

use App\Models\TeamApplication;
use Inertia\Inertia;

use Illuminate\Http\Request;
use App\Models\TeamReviewAction;
use App\Models\TeamStatusLog;
use App\Models\TeamCorrectionRequest;

class TeamApplicationReviewController extends Controller
{




public function correctionReview(TeamApplication $teamApplication)
{
    $teamApplication->load([
        'documents',
        'correctionRequests',
        'statusLogs',
    ]);

    return Inertia::render('Admin/TeamApplications/CorrectionReview', [
        'application' => [
            ...$teamApplication->toArray(),
            'documents' => $teamApplication->documents->map(function ($document) {
                return [
                    ...$document->toArray(),
                    'file_url' => asset('storage/' . $document->file_path),
                ];
            }),
        ],
        'latestCorrectionRequest' => $teamApplication->correctionRequests()
            ->latest()
            ->first(),
        'latestCorrectionLog' => $teamApplication->statusLogs()
            ->where('new_status', 'correction_submitted')
            ->latest()
            ->first(),
    ]);
}



    public function index()
    {
        $applications = TeamApplication::latest()
            ->get();

        return Inertia::render('Admin/TeamApplications/Index', [
            'applications' => $applications,
        ]);
    }

    public function show(TeamApplication $teamApplication)
{
    $teamApplication->load([
        'documents',
        'correctionRequests',
        'reviewActions.reviewer',
        'statusLogs.changer',
        'approvedByUser',
        'rejectedByUser',
    ]);

    return Inertia::render('Admin/TeamApplications/Show', [
        'application' => [
            ...$teamApplication->toArray(),
            'documents' => $teamApplication->documents->map(function ($document) {
                return [
                    ...$document->toArray(),
                    'file_url' => asset('storage/' . $document->file_path),
                ];
            }),
        ],
    ]);
}


public function approvedTeachers()
{
    $teachers = TeamApplication::where('application_type', 'volunteer_teacher')
        ->where('status', 'approved')
        ->latest('approved_at')
        ->get();

    return Inertia::render('Admin/TeamApplications/ApprovedTeachers', [
        'teachers' => $teachers,
    ]);
}

public function approve(Request $request, TeamApplication $teamApplication)
{
    $oldStatus = $teamApplication->status;

    $teamApplication->update([
        'status' => 'approved',
        'approved_at' => now(),
        'approved_by' => auth()->id(),
        'rejected_at' => null,
        'rejected_by' => null,
        'reviewed_at' => now(),
        'reviewed_by' => auth()->id(),
    ]);

    TeamReviewAction::create([
        'team_application_id' => $teamApplication->id,
        'reviewer_id' => auth()->id(),
        'action' => 'approved',
        'notes' => $request->notes,
    ]);

    TeamStatusLog::create([
        'team_application_id' => $teamApplication->id,
        'old_status' => $oldStatus,
        'new_status' => 'approved',
        'changed_by' => auth()->id(),
        'notes' => $request->notes,
    ]);

    return back()->with('success', 'Application approved.');
}



public function reject(Request $request, TeamApplication $teamApplication)
{
    $request->validate([
        'notes' => 'required|string|min:10',
    ]);

    $oldStatus = $teamApplication->status;

    $teamApplication->update([
        'status' => 'rejected',
        'reviewer_notes' => $request->notes,
        'rejected_at' => now(),
        'rejected_by' => auth()->id(),
        'approved_at' => null,
        'approved_by' => null,
        'reviewed_at' => now(),
        'reviewed_by' => auth()->id(),
    ]);

    TeamReviewAction::create([
        'team_application_id' => $teamApplication->id,
        'reviewer_id' => auth()->id(),
        'action' => 'rejected',
        'notes' => $request->notes,
    ]);

    TeamStatusLog::create([
        'team_application_id' => $teamApplication->id,
        'old_status' => $oldStatus,
        'new_status' => 'rejected',
        'changed_by' => auth()->id(),
        'notes' => $request->notes,
    ]);

    return back()->with('success', 'Application rejected.');
}


public function requestCorrection(Request $request, TeamApplication $teamApplication)
{
    $request->validate([
        'message' => 'required|string|min:10',
    ]);

    $oldStatus = $teamApplication->status;

    TeamCorrectionRequest::create([
        'team_application_id' => $teamApplication->id,
        'reviewer_id' => auth()->id(),
        'message' => $request->message,
        'status' => 'open',
    ]);

    $teamApplication->update([
        'status' => 'need_correction',
    ]);

    TeamStatusLog::create([
        'team_application_id' => $teamApplication->id,
        'old_status' => $oldStatus,
        'new_status' => 'need_correction',
        'changed_by' => auth()->id(),
        'notes' => $request->message,
    ]);

    return back()->with('success', 'Correction requested.');
}

}
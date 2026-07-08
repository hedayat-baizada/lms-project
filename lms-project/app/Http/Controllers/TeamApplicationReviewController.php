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

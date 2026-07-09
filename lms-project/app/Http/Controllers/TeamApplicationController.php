<?php

namespace App\Http\Controllers;

use App\Models\TeamApplication;
use App\Models\TeamApplicationDocument;
use App\Models\TeamStatusLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamApplicationController extends Controller
{


public function correction(TeamApplication $teamApplication)
{
    abort_unless(
        in_array($teamApplication->status, ['need_correction', 'correction_submitted']),
        404
    );

    $teamApplication->load('correctionRequests');

    return Inertia::render('Apply/Team/Correction', [
        'application' => $teamApplication,
        'latestCorrectionRequest' => $teamApplication->correctionRequests()
            ->latest()
            ->first(),
    ]);
}

public function storeCorrection(Request $request, TeamApplication $teamApplication)
{
    abort_unless($teamApplication->status === 'need_correction', 404);

    $validated = $request->validate([
        'correction_note' => 'required|string|min:5|max:3000',
        'photo' => 'nullable|image|max:2048',
        'cv' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
    ]);

    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('team-applications/photos', 'public');

        TeamApplicationDocument::create([
            'team_application_id' => $teamApplication->id,
            'document_type' => 'photo_correction',
            'file_path' => $path,
        ]);
    }

    if ($request->hasFile('cv')) {
        $path = $request->file('cv')->store('team-applications/cv', 'public');

        TeamApplicationDocument::create([
            'team_application_id' => $teamApplication->id,
            'document_type' => 'cv_correction',
            'file_path' => $path,
        ]);
    }

    $oldStatus = $teamApplication->status;

    $teamApplication->update([
        'status' => 'correction_submitted',
    ]);

    TeamStatusLog::create([
        'team_application_id' => $teamApplication->id,
        'old_status' => $oldStatus,
        'new_status' => 'correction_submitted',
        'changed_by' => null,
        'notes' => 'Applicant submitted a correction: ' . $validated['correction_note'],
    ]);

    $teamApplication->correctionRequests()
        ->where('status', 'open')
        ->update(['status' => 'resolved']);

    return redirect()
    ->route('apply.track', [
        'tracking_code' => $teamApplication->tracking_code,
    ])
    ->with('message', 'Your correction has been submitted successfully.');
}

public function create()
{
    $type = request('type');
    $subject = request('subject');

    abort_unless(
        in_array($type, [
            'volunteer_teacher',
            'volunteer_manager',
            'volunteer_support',
            'professional_staff',
        ]),
        404
    );

    if ($type === 'volunteer_teacher') {
        abort_unless(in_array($subject, ['english', 'computer']), 404);
    }

    return Inertia::render('Apply/Team/TeamApplicationForm', [
        'type' => $type,
        'subject' => $subject,
    ]);
}

public function store(Request $request)
{
    $type = $request->input('application_type');
    $subject = $request->input('teacher_subject');

    abort_unless(
        in_array($type, [
            'volunteer_teacher',
            'volunteer_manager',
            'volunteer_support',
            'professional_staff',
        ]),
        404
    );

    if ($type === 'volunteer_teacher') {
        abort_unless(in_array($subject, ['english', 'computer']), 404);
    }

    $validated = $request->validate([
    'application_type' => 'required|in:volunteer_teacher,volunteer_manager,volunteer_support,professional_staff',
    'teacher_subject' => 'nullable|in:english,computer',

    'full_name' => 'required|string|min:3|max:100',
    'email' => 'required|email|max:255',
    'whatsapp_number' => 'required|string|max:30',
    'mobile_number' => 'nullable|string|max:30',
    'date_of_birth' => 'nullable|date|before:today',
    'gender' => 'required|string|in:male,female',
    'address' => 'required|string|max:500',
    'permanent_address' => 'nullable|string|max:500',

    'education_level' => 'required|string|max:2000',
    'university_school' => 'nullable|string|max:255',
    'date_of_graduation' => 'nullable|date',

    'language_qualification' => 'required_if:teacher_subject,english|nullable|string|max:2000',
    'qualification_completion_date' => 'nullable|date',
    'teaching_experience_years' => 'nullable|numeric|min:0|max:80',

    'computer_qualification' => 'required_if:teacher_subject,computer|nullable|string|max:2000',
    'computer_skills' => 'required_if:teacher_subject,computer|nullable|string|max:1000',

    'field_of_study' => 'required_if:application_type,professional_staff|nullable|string|max:255',

    'experience' => [
        'nullable',
        'string',
        'max:2000',
        'required_if:application_type,volunteer_manager',
        'required_if:application_type,volunteer_support',
        'required_if:application_type,professional_staff',
    ],

    'skills' => [
        'nullable',
        'string',
        'max:1000',
        'required_if:application_type,volunteer_manager',
        'required_if:application_type,volunteer_support',
    ],

    'motivation' => 'required|string|min:150|max:5000',
    'availability' => 'required|string|max:255',
    'preferred_mode' => 'required|in:online,physical,both',

   'photo' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
    'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
]);

    $application = TeamApplication::create([
        ...$validated,
        'tracking_code' => $this->generateTrackingCode(),
        'application_type' => $type,
        'teacher_subject' => $type === 'volunteer_teacher' ? $subject : null,
        'phone' => $validated['whatsapp_number'],
        'status' => 'waiting_review',
        'submitted_at' => now(),
    ]);

    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('team-applications/photos', 'public');

        TeamApplicationDocument::create([
            'team_application_id' => $application->id,
            'document_type' => 'photo',
            'file_path' => $path,
        ]);
    }

    if ($request->hasFile('cv')) {
        $path = $request->file('cv')->store('team-applications/cv', 'public');

        TeamApplicationDocument::create([
            'team_application_id' => $application->id,
            'document_type' => 'cv',
            'file_path' => $path,
        ]);
    }

    TeamStatusLog::create([
        'team_application_id' => $application->id,
        'old_status' => null,
        'new_status' => 'waiting_review',
        'changed_by' => null,
        'notes' => 'Team application submitted.',
    ]);

    return redirect()->route('apply.team.submitted', $application->id);
}

    public function storeTeacher(Request $request, string $subject)
    {
        abort_unless(in_array($subject, ['english', 'computer']), 404);

        $validated = $request->validate([
            'full_name' => 'required|string|min:3|max:100',
            'email' => 'required|email|max:255',
            'whatsapp_number' => 'required|string|max:30',
            'mobile_number' => 'nullable|string|max:30',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|string|max:20',
            'address' => 'required|string|max:500',
            'permanent_address' => 'nullable|string|max:500',

            'education_level' => 'required|string|max:255',
            'university_school' => 'nullable|string|max:255',
            'date_of_graduation' => 'nullable|date',

            'language_qualification' => 'nullable|string|max:255',
            'qualification_completion_date' => 'nullable|date',
            'teaching_experience_years' => 'nullable|numeric|min:0|max:80',

            'computer_qualification' => 'nullable|string|max:255',
            'computer_skills' => 'nullable|string|max:1000',

            'experience' => 'nullable|string|max:2000',
            'skills' => 'nullable|string|max:1000',
            'motivation' => 'required|string|min:150|max:5000',
            'availability' => 'required|string|max:255',
            'preferred_mode' => 'required|in:online,physical,both',

            'photo' => 'nullable|image|max:2048',
            'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $application = TeamApplication::create([
            ...$validated,
            'tracking_code' => $this->generateTrackingCode(),
            'application_type' => 'volunteer_teacher',
            'teacher_subject' => $subject,
            'phone' => $validated['whatsapp_number'],
            'status' => 'waiting_review',
            'submitted_at' => now(),
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('team-applications/photos', 'public');

            TeamApplicationDocument::create([
                'team_application_id' => $application->id,
                'document_type' => 'photo',
                'file_path' => $path,
            ]);
        }

        if ($request->hasFile('cv')) {
            $path = $request->file('cv')->store('team-applications/cv', 'public');

            TeamApplicationDocument::create([
                'team_application_id' => $application->id,
                'document_type' => 'cv',
                'file_path' => $path,
            ]);
        }

        TeamStatusLog::create([
    'team_application_id' => $application->id,
    'old_status' => null,
    'new_status' => 'waiting_review',
    'changed_by' => null,
    'notes' => 'Team application submitted.',
]);

        return redirect()
    ->route('apply.team.submitted', $application->id);
    }

    private function generateTrackingCode(): string
    {
        do {
            $code = 'TEAM-' . now()->format('Y') . '-' . strtoupper(str()->random(6));
        } while (TeamApplication::where('tracking_code', $code)->exists());

        return $code;
    }

    public function submitted(TeamApplication $teamApplication)
{
    return Inertia::render('Apply/Team/Submitted', [
        'application' => $teamApplication,
    ]);
}
}
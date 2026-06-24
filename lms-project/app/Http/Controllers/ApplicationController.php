<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\ApplicationDocument;
use App\Models\GuardianInfo;

class ApplicationController extends Controller
{
    public function student()
    {
        return Inertia::render('Apply/Student');
    }

    public function storePersonalInfo(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|max:50',
            'address' => 'required|string|max:1000',
        ]);

        $existingApplication = Application::where('email', $validated['email'])->first();

        if ($existingApplication) {
            if ($existingApplication->status === 'incomplete') {
                return redirect()
                    ->route('apply.student')
                    ->with('message', 'You already started an application. Please continue your application.');
            }

            if ($existingApplication->status === 'waiting_review') {
                return redirect()
                    ->route('apply.student')
                    ->with('message', 'Your application is already submitted and waiting for review.');
            }

            if ($existingApplication->status === 'approved') {
                return redirect()
                    ->route('login')
                    ->with('message', 'Your application has been approved. Please login.');
            }

            if ($existingApplication->status === 'rejected') {
                return redirect()
                    ->route('apply.student')
                    ->with('message', 'Your application was rejected. Reason: ' . $existingApplication->reviewer_notes);
            }
        }

        $application = Application::create([
            ...$validated,
            'tracking_code' => $this->generateTrackingCode(),
            'status' => 'incomplete',
        ]);

        return redirect()
            ->route('apply.student.document', $application->id)
            ->with('message', 'Personal information saved successfully.');
    }

    private function generateTrackingCode()
    {
        $year = now()->year;

        $lastApplication = Application::whereYear('created_at', $year)
            ->latest('id')
            ->first();

        $nextNumber = $lastApplication ? $lastApplication->id + 1 : 1;

        return 'APP-' . $year . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }




    public function document(Application $application)
{
    return Inertia::render('Apply/Document', [
        'application' => $application,
    ]);
}

public function storeDocument(Request $request, Application $application)
{
    $validated = $request->validate([
        'document_option' => 'required|string',
        'document_number' => 'nullable|string|max:255',
        'document_name' => 'nullable|string|max:255',
        'document_file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:4096',

        'guardian_full_name' => 'nullable|string|max:255',
        'guardian_relationship' => 'nullable|string|max:255',
        'guardian_phone' => 'nullable|string|max:50',
        'guardian_document_type' => 'nullable|string|max:255',
        'guardian_document_number' => 'nullable|string|max:255',
    ]);

    $filePath = $request->file('document_file')->store('application-documents', 'public');

    if ($validated['document_option'] === 'no_own_document') {
        $request->validate([
            'guardian_full_name' => 'required|string|max:255',
            'guardian_relationship' => 'required|string|max:255',
            'guardian_phone' => 'required|string|max:50',
            'guardian_document_type' => 'required|string|max:255',
            'guardian_document_number' => 'required|string|max:255',
        ]);

        GuardianInfo::create([
            'application_id' => $application->id,
            'full_name' => $validated['guardian_full_name'],
            'relationship' => $validated['guardian_relationship'],
            'phone' => $validated['guardian_phone'],
            'document_type' => $validated['guardian_document_type'],
            'document_number' => $validated['guardian_document_number'],
        ]);

        ApplicationDocument::create([
            'application_id' => $application->id,
            'document_owner_type' => 'guardian',
            'document_type' => $validated['guardian_document_type'],
            'document_name' => null,
            'document_number' => $validated['guardian_document_number'],
            'file_path' => $filePath,
            'status' => 'pending',
        ]);
    } else {
        ApplicationDocument::create([
            'application_id' => $application->id,
            'document_owner_type' => 'applicant',
            'document_type' => $validated['document_option'],
            'document_name' => $validated['document_name'] ?? null,
            'document_number' => $validated['document_number'] ?? null,
            'file_path' => $filePath,
            'status' => 'pending',
        ]);
    }

    return redirect()
        ->route('apply.student.course', $application->id)
        ->with('message', 'Identity document saved successfully.');
}



public function course(Application $application)
{
    return Inertia::render('Apply/Course', [
        'application' => $application,
    ]);
}

public function storeCourse(Request $request, Application $application)
{
    $validated = $request->validate([
        'course_category' => 'required|string',
        'course_track' => 'nullable|string',
        'requested_level' => 'nullable|string',
        'selected_computer_topic' => 'nullable|string',
    ]);

    $testRequired = false;
    $speakingRequired = false;

    if ($validated['course_category'] === 'english') {
        if ($validated['course_track'] === 'prep_cel') {
            $testRequired = $validated['requested_level'] !== 'A1';
            $speakingRequired = false;
        }

        if ($validated['course_track'] === 'cel') {
            $testRequired = true;
            $speakingRequired = true;
        }
    }

    if ($validated['course_category'] === 'computer') {
        $testRequired = false;
        $speakingRequired = false;
    }

    $application->update([
        'course_category' => $validated['course_category'],
        'course_track' => $validated['course_track'] ?? null,
        'requested_level_id' => null,
        'selected_computer_topic' => $validated['selected_computer_topic'] ?? $validated['requested_level'] ?? null,
        'test_required' => $testRequired,
        'speaking_required' => $speakingRequired,
    ]);

    if ($testRequired) {
        return redirect()->route('apply.student.test', $application->id);
    }

    return redirect()->route('apply.student.review', $application->id);
}
}
<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
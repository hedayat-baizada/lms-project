<?php

namespace App\Http\Controllers;
use App\Models\PlacementQuestion;
use App\Models\PlacementTest;
use App\Models\PlacementTestQuestion;
use App\Models\SpeakingTest;

use App\Models\TeamApplication;
use App\Models\PlacementAnswer;

use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\ApplicationDocument;
use App\Models\GuardianInfo;

class ApplicationController extends Controller
{


public function correction(Application $application)
{
    $application->load(['correctionRequests']);

    if ($application->status !== 'need_correction') {
        return redirect()->route('apply.track', [
            'tracking_code' => $application->tracking_code,
        ]);
    }

    return Inertia::render('Apply/Correction', [
        'application' => $application,
        'latestCorrectionRequest' => $application->correctionRequests()
            ->latest()
            ->first(),
    ]);
}

public function storeCorrection(Request $request, Application $application)
{
    if ($application->status !== 'need_correction') {
        return redirect()->route('apply.track', [
            'tracking_code' => $application->tracking_code,
        ]);
    }

    $validated = $request->validate([
        'correction_message' => 'required|string|max:2000',
        'correction_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
    ]);

    $filePath = null;

    if ($request->hasFile('correction_file')) {
        $filePath = $request->file('correction_file')
            ->store('application_corrections', 'public');
    }

    // \App\Models\ReviewAction::create([
    //     'application_id' => $application->id,
    //     'reviewer_id' => null,
    //     'action' => 'applicant_correction_submitted',
    //     'notes' => $validated['correction_message'],
    // ]);

    if ($filePath) {
        \App\Models\ApplicationDocument::create([
            'application_id' => $application->id,
            'document_owner_type' => 'applicant',
            'document_type' => 'correction',
            'document_number' => null,
            'file_path' => $filePath,
            'status' => 'submitted',
        ]);
    }

   $oldStatus = $application->status;

$application->update([
    'status' => 'correction_submitted',
]);

\App\Models\ApplicationStatusLog::create([
    'application_id' => $application->id,
    'old_status' => $oldStatus,
    'new_status' => 'correction_submitted',
    'changed_by' => null,
    'notes' => 'Applicant submitted a correction: ' . $validated['correction_message'],
]);

return redirect()
    ->route('apply.track', [
        'tracking_code' => $application->tracking_code,
    ])
    ->with('success', 'Your correction has been submitted successfully. Your application is now waiting for another review.');
}


public function track(Request $request)
{
    $trackingCode = $request->query('tracking_code');

    $application = null;
    $applicationType = null;

    if ($trackingCode) {
        $application = Application::with([
            'documents',
            'correctionRequests',
            'reviewActions',
            'statusLogs',
        ])
            ->where('tracking_code', $trackingCode)
            ->first();

        if ($application) {
            $applicationType = 'student';
        }

        if (! $application) {
            $application = TeamApplication::with([
                'documents',
                'correctionRequests',
                'reviewActions',
                'statusLogs',
            ])
                ->where('tracking_code', $trackingCode)
                ->first();

            if ($application) {
                $applicationType = 'team';
            }
        }
    }

    return Inertia::render('Apply/Track', [
        'application' => $application,
        'applicationType' => $applicationType,
        'trackingCode' => $trackingCode,
    ]);
}


public function startSpeaking(Application $application)
{
    if ($application->course_track !== 'cel') {
        return redirect()->route('apply.student.review', $application->id);
    }

    $speakingTest = SpeakingTest::firstOrCreate(
        ['application_id' => $application->id],
        ['status' => 'not_started']
    );

    if ($speakingTest->attempt_used) {
        return back()->with('message', 'Speaking attempt already used.');
    }

    $speakingTest->update([
        'status' => 'recording',
        'started_at' => now(),
        'expires_at' => now()->addMinutes(2),
        'attempt_used' => true,
    ]);

    return back();
}


public function writing(Application $application)
{
    if ($application->course_track !== 'cel') {
        return redirect()->route('apply.student.review', $application->id);
    }

    $placementTest = PlacementTest::where('application_id', $application->id)
        ->firstOrFail();

        $writingPrompt = PlacementQuestion::where('test_code', $placementTest->test_code)
    ->where('section', 'writing')
    ->where('status', 'active')
    ->first();

    return Inertia::render('Apply/Writing', [
        'application' => $application,
        'placementTest' => $placementTest,
        'writingPrompt' => $writingPrompt,
    ]);
}

public function storeWriting(Request $request, Application $application)
{
    $validated = $request->validate([
        'writing_answer' => 'nullable|string|max:5000',
    ]);

    $application->placementTest->update([
        'writing_answer' => $validated['writing_answer'] ?? '',
    ]);

    return redirect()->route('apply.student.speaking', $application->id);
}


public function saveTestDrafts(Request $request, Application $application)
{
    $validated = $request->validate([
        'answers' => 'nullable|array',
    ]);

    $answers = $validated['answers'] ?? [];

    $placementTest = PlacementTest::where('application_id', $application->id)
        ->where('status', 'in_progress')
        ->firstOrFail();

    foreach ($answers as $testQuestionId => $answerText) {
        $testQuestion = PlacementTestQuestion::where('id', $testQuestionId)
            ->where('placement_test_id', $placementTest->id)
            ->first();

        if (! $testQuestion) {
            continue;
        }

        PlacementAnswer::updateOrCreate(
            [
                'placement_test_id' => $placementTest->id,
                'placement_test_question_id' => $testQuestion->id,
            ],
            [
                'question_id' => $testQuestion->placement_question_id,
                'answer_text' => $answerText,
            ]
        );
    }

    return response()->json([
        'saved' => true,
    ]);
}




public function speaking(Application $application)
{
    if ($application->course_track !== 'cel') {
        return redirect()->route('apply.student.review', $application->id);
    }

    $speakingTest = SpeakingTest::firstOrCreate(
        ['application_id' => $application->id],
        ['status' => 'not_started']
    );

    if (
        $speakingTest->status === 'recording' &&
        $speakingTest->expires_at &&
        now()->greaterThan($speakingTest->expires_at)
    ) {
        $speakingTest->update([
            'status' => 'expired',
        ]);
    }


    $placementTest = PlacementTest::where('application_id', $application->id)
    ->firstOrFail();

$speakingPrompt = PlacementQuestion::where('test_code', $placementTest->test_code)
    ->where('section', 'speaking')
    ->where('status', 'active')
    ->first();

    return Inertia::render('Apply/Speaking', [
        'application' => $application,
        'speakingTest' => $speakingTest,
       'prompt' => $speakingPrompt?->question_text ?? 'Discuss your plan for further education.',
        'speakingDuration' => $speakingPrompt?->duration_minutes ?? 2,
    ]);
}

public function storeSpeaking(Request $request, Application $application)
{
    $validated = $request->validate([
        'audio_file' => 'required|file|mimes:webm,mp3,wav,ogg|max:10240',
    ]);

    $path = $request->file('audio_file')->store('speaking-tests', 'public');

    SpeakingTest::updateOrCreate(
    ['application_id' => $application->id],
    [
        'audio_path' => $path,
        'status' => 'submitted',
        'submitted_at' => now(),
    ]
);

    return redirect()->route('apply.student.review', $application->id);
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
        ->route('apply.student.submitted', $application->id)
        ->with('success', 'Your application has been submitted successfully.');
}




        public function saveTestDraft(Request $request, Application $application)
{
    $validated = $request->validate([
        'test_question_id' => 'required|integer',
        'answer_text' => 'nullable',
    ]);

    $placementTest = PlacementTest::where('application_id', $application->id)
        ->where('status', 'in_progress')
        ->firstOrFail();

    $testQuestion = PlacementTestQuestion::where('id', $validated['test_question_id'])
        ->where('placement_test_id', $placementTest->id)
        ->firstOrFail();

    PlacementAnswer::updateOrCreate(
        [
            'placement_test_id' => $placementTest->id,
            'placement_test_question_id' => $testQuestion->id,
        ],
        [
            'question_id' => $testQuestion->placement_question_id,
            'answer_text' => $validated['answer_text'],
        ]
    );

    return back();
}






   public function storeTestAnswers(Request $request, Application $application)
{
    $validated = $request->validate([
        'answers' => 'nullable|array',
    ]);

    $answers = $validated['answers'] ?? [];

    $placementTest = PlacementTest::where('application_id', $application->id)
        ->firstOrFail();

    if ($placementTest->status === 'submitted') {
        if ($application->course_track === 'cel') {
            return redirect()->route('apply.student.writing', $application->id);
        }

        return redirect()->route('apply.student.review', $application->id);
    }

    foreach ($answers as $testQuestionId => $answerText) {
        $testQuestion = PlacementTestQuestion::with('placementQuestion')
            ->findOrFail($testQuestionId);

        $question = $testQuestion->placementQuestion;

        $isCorrect = false;

        if ($question->question_type === 'mcq') {
            $isCorrect = strtolower(trim($answerText)) === strtolower(trim($question->correct_answer));
        } else {
            $isCorrect = $this->normalizeAnswer($answerText) === $this->normalizeAnswer($question->correct_answer);
        }

        PlacementAnswer::updateOrCreate(
            [
                'placement_test_id' => $placementTest->id,
                'placement_test_question_id' => $testQuestionId,
            ],
            [
                'question_id' => $question->id,
                'answer_text' => $answerText,
                'score' => $isCorrect ? 1 : 0,
            ]
        );
    }

    $totalScore = PlacementAnswer::where('placement_test_id', $placementTest->id)
        ->sum('score');

    $placementTest->update([
        'status' => 'submitted',
        'submitted_at' => now(),
        'total_score' => $totalScore,
    ]);

    if ($application->course_track === 'cel') {
        return redirect()->route('apply.student.writing', $application->id);
    }

    return redirect()->route('apply.student.review', $application->id);
}


private function normalizeAnswer(?string $answer): string
{
    $answer = strtolower($answer ?? '');

    $answer = preg_replace('/[^\p{L}\p{N}\s]/u', '', $answer);

    $answer = preg_replace('/\s+/', ' ', $answer);

    return trim($answer);
}



    public function test(Application $application)
{
    $placementTest = PlacementTest::where('application_id', $application->id)
        ->first();
        if ($placementTest && $placementTest->status === 'submitted') {
    if ($application->course_track === 'cel') {
        return redirect()->route('apply.student.writing', $application->id);
    }

    return redirect()->route('apply.student.review', $application->id);
}

    if (! $placementTest) {
        $testCode = 'prep_cel';
        $durationMinutes = 50;

        if ($application->course_track === 'cel') {
            $testCode = collect(['cel_a', 'cel_b'])->random();
            $durationMinutes = 80;
        }

        $placementTest = PlacementTest::create([
            'application_id' => $application->id,
            'test_type' => $application->course_track,
            'test_code' => $testCode,
            'is_required' => true,
            'status' => 'in_progress',
            'started_at' => now(),
            'expires_at' => now()->addMinutes($durationMinutes),
            'duration_minutes' => $durationMinutes,
        ]);

       $questions = PlacementQuestion::where('test_code', $testCode)
    ->whereIn('section', ['mcq', 'short_answer'])
    ->where('status', 'active')
    ->get();

$displayOrder = 1;

if ($application->course_track === 'cel') {
    $questions
        ->groupBy('passage_number')
        ->shuffle()
        ->each(function ($group) use ($placementTest, &$displayOrder) {
            $group
                ->sortBy('blank_number')
                ->each(function ($question) use ($placementTest, &$displayOrder) {
                    PlacementTestQuestion::create([
                        'placement_test_id' => $placementTest->id,
                        'placement_question_id' => $question->id,
                        'display_order' => $displayOrder++,
                    ]);
                });
        });
} else {
    $questions
        ->shuffle()
        ->each(function ($question) use ($placementTest, &$displayOrder) {
            PlacementTestQuestion::create([
                'placement_test_id' => $placementTest->id,
                'placement_question_id' => $question->id,
                'display_order' => $displayOrder++,
            ]);
        });
}
    }

    $placementTest->load('testQuestions.placementQuestion');

    $existingAnswers = PlacementAnswer::where('placement_test_id', $placementTest->id)
    ->pluck('answer_text', 'placement_test_question_id');
    return Inertia::render('Apply/Test', [
        'application' => $application,
        'placementTest' => $placementTest,
        'questions' => $placementTest->testQuestions
            ->sortBy('display_order')
            ->values()
            ->map(function ($testQuestion) {
    return [
        'test_question_id' => $testQuestion->id,
        'id' => $testQuestion->placementQuestion->id,
        'display_order' => $testQuestion->display_order,
        'question_text' => $testQuestion->placementQuestion->question_text,
        'question_type' => $testQuestion->placementQuestion->question_type,
        'passage_number' => $testQuestion->placementQuestion->passage_number,
        'blank_number' => $testQuestion->placementQuestion->blank_number,
        'passage_text' => $testQuestion->placementQuestion->passage_text,
        'option_a' => $testQuestion->placementQuestion->option_a,
        'option_b' => $testQuestion->placementQuestion->option_b,
        'option_c' => $testQuestion->placementQuestion->option_c,
        'option_d' => $testQuestion->placementQuestion->option_d,
    ];
}),

'existingAnswers' => $existingAnswers,
    ]);
}


    public function student()
    {
        return Inertia::render('Apply/Student');
    }

    public function storePersonalInfo(Request $request)
    {
        $validated = $request->validate([
    'full_name' => [
        'required',
        'string',
        'min:3',
        'max:100',
    ],

    'father_name' => [
        'required',
        'string',
        'min:3',
        'max:100',
    ],

    'email' => [
        'required',
        'email',
        'max:255',
        'unique:applications,email',
    ],

    'phone' => [
        'required',
        'regex:/^[0-9+\-\s]{8,20}$/',
    ],

    'date_of_birth' => [
        'required',
        'date',
        'before:today',
    ],

    'gender' => [
        'required',
        'in:male,female',
    ],

    'address' => [
        'required',
        'string',
        'min:10',
        'max:500',
    ],
],
[
    'email.unique' => 'This email address has already been used for an application.',

    'phone.regex' => 'Please enter a valid phone number.',

    'date_of_birth.before' => 'Please enter a valid date of birth.',
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


    public function skipSpeaking(Application $application)
{
    $speakingTest = SpeakingTest::updateOrCreate(
        ['application_id' => $application->id],
        [
            'status' => 'skipped',
            'attempt_used' => true,
            'submitted_at' => now(),
        ]
    );

    return redirect()->route('apply.student.review', $application->id);
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

    $existingTest = PlacementTest::where('application_id', $application->id)
    ->whereIn('status', ['in_progress', 'submitted'])
    ->first();

if ($existingTest) {
    return redirect()->route('apply.student.instructions', $application->id)
        ->with('error', 'Your placement test has already started. You cannot change your course selection now.');
}


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
        return redirect()->route('apply.student.instructions', $application->id);
    }

    return redirect()->route('apply.student.review', $application->id);
}



public function instructions(Application $application)
{
    $placementTest = PlacementTest::where('application_id', $application->id)
        ->whereIn('status', ['in_progress', 'submitted'])
        ->first();

    return Inertia::render('Apply/Instructions', [
        'application' => $application,
        'placementTest' => $placementTest,
    ]);
}


public function submitted(Application $application)
{
    return Inertia::render('Apply/Submitted', [
        'application' => $application,
    ]);
}
}
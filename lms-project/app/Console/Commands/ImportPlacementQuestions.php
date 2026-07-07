<?php

namespace App\Console\Commands;

use App\Models\PlacementQuestion;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ImportPlacementQuestions extends Command
{
    protected $signature = 'questions:import';

    protected $description = 'Import placement questions from JSON question bank files';

    public function handle(): int
    {
        $questionBanks = [
            [
                'file' => 'database/data/prep_cel.json',
                'test_code' => 'prep_cel',
                'course_track' => 'prep_cel',
            ],
            [
                'file' => 'database/data/cel_a.json',
                'test_code' => 'cel_a',
                'course_track' => 'cel',
            ],
            [
                'file' => 'database/data/cel_b.json',
                'test_code' => 'cel_b',
                'course_track' => 'cel',
            ],
        ];

        $totalImported = 0;

        foreach ($questionBanks as $bank) {
            $totalImported += $this->importBank(
                $bank['file'],
                $bank['test_code'],
                $bank['course_track']
            );
        }

        $this->newLine();
        $this->info("Finished. Total imported: {$totalImported}");

        return self::SUCCESS;
    }

    private function importBank(string $file, string $testCode, string $courseTrack): int
    {
        $path = base_path($file);

        if (! File::exists($path)) {
            $this->warn("Skipped {$testCode}: file not found ({$file})");
            return 0;
        }

        $questions = json_decode(File::get($path), true);

        if (! is_array($questions)) {
            $this->error("Skipped {$testCode}: invalid JSON");
            return 0;
        }

        PlacementQuestion::where('test_code', $testCode)->delete();

        foreach ($questions as $question) {
            PlacementQuestion::updateOrCreate(
                [
                    'test_code' => $testCode,
                    'question_number' => $question['question_number'],
                ],
                [
                    'course_track' => $courseTrack,
                    'section' => $question['section'] ?? 'mcq',
                    'question_text' => $question['question_text'],
                    'question_type' => $question['question_type'],
                    'option_a' => $question['option_a'] ?? null,
                    'option_b' => $question['option_b'] ?? null,
                    'option_c' => $question['option_c'] ?? null,
                    'option_d' => $question['option_d'] ?? null,
                    'correct_answer' => $question['correct_answer'] ?? null,
                    'marks' => $question['marks'] ?? 1,
                    'duration_minutes' => $question['duration_minutes'] ?? null,
                    'word_limit' => $question['word_limit'] ?? null,
                    'status' => $question['status'] ?? 'active',
                ]
            );
        }

        $count = count($questions);

        $this->info("Imported {$count} questions for {$testCode}");

        return $count;
    }
}
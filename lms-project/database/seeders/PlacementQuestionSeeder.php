<?php

namespace Database\Seeders;

use App\Models\PlacementQuestion;
use Illuminate\Database\Seeder;

class PlacementQuestionSeeder extends Seeder
{
    public function run(): void
    {
        PlacementQuestion::where('test_code', 'prep_cel')->delete();

        $questions = [
            [
                'question_number' => 1,
                'question_text' => 'What is the correct way to introduce yourself?',
                'option_a' => 'Goodbye! My name is Tom.',
                'option_b' => 'Hello! My name is Tom.',
                'option_c' => 'How are you? My name is Tom.',
                'option_d' => 'See you! My name is Tom.',
                'correct_answer' => 'b',
            ],
            [
                'question_number' => 2,
                'question_text' => 'Which of the following is a correct sentence using the verb "to be"?',
                'option_a' => 'I is happy.',
                'option_b' => 'He are sad.',
                'option_c' => 'She is my friend.',
                'option_d' => 'They am playing.',
                'correct_answer' => 'c',
            ],
            [
                'question_number' => 3,
                'question_text' => 'What is the missing word in this sentence: "____ is your name?"',
                'option_a' => 'How',
                'option_b' => 'What',
                'option_c' => 'Where',
                'option_d' => 'Who',
                'correct_answer' => 'b',
            ],
        ];

        foreach ($questions as $question) {
            PlacementQuestion::create([
                'test_code' => 'prep_cel',
                'course_track' => 'prep_cel',
                'level_id' => null,
                'question_number' => $question['question_number'],
                'question_text' => $question['question_text'],
                'question_type' => 'mcq',
                'option_a' => $question['option_a'],
                'option_b' => $question['option_b'],
                'option_c' => $question['option_c'],
                'option_d' => $question['option_d'],
                'correct_answer' => $question['correct_answer'],
                'marks' => 1,
                'status' => 'active',
            ]);
        }
    }
}
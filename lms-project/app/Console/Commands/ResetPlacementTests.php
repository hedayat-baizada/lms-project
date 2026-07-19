<?php

namespace App\Console\Commands;

use App\Models\PlacementAnswer;
use App\Models\PlacementTest;
use App\Models\PlacementTestQuestion;
use Illuminate\Console\Command;

class ResetPlacementTests extends Command
{
    protected $signature = 'placement:reset-tests';

    protected $description = 'Delete placement test sessions, randomized questions, and answers';

    public function handle(): int
    {
        PlacementAnswer::query()->delete();
        PlacementTestQuestion::query()->delete();
        PlacementTest::query()->delete();

        $this->info('Placement test data reset successfully.');

        return self::SUCCESS;
    }
}
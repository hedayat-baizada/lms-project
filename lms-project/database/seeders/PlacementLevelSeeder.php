<?php

namespace Database\Seeders;

use App\Models\PlacementLevel;
use Illuminate\Database\Seeder;

class PlacementLevelSeeder extends Seeder
{
    public function run(): void
    {
        PlacementLevel::truncate();

        $levels = [

            // Prep-CEL

            ['prep_cel','A1', 'A1 Class',1],
            ['prep_cel','A2', 'A2 Class',2],
            ['prep_cel','A3', 'A3 Class',3],
            ['prep_cel','A4', 'A4 Class',4],
            ['prep_cel','A5', 'A5 Class',5],
            ['prep_cel','A6', 'A6 Class',6],

            // CEL

            ['cel','Beginner','Beginner',1],
            ['cel','Elementary','Elementary',2],
            ['cel','Pre-Intermediate','Pre-Intermediate',3],
            ['cel','Intermediate','Intermediate',4],
            ['cel','Upper Intermediate','Upper Intermediate',5],
            ['cel','Advanced','Advanced',6],

        ];

        foreach ($levels as $level) {

            PlacementLevel::create([
                'program' => $level[0],
                'level_code' => $level[1],
                'display_name' => $level[2],
                'display_order' => $level[3],
            ]);

        }
    }
}
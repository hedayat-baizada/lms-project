<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class LmsPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'classes.view', 'classes.create', 'classes.edit', 'classes.delete',
            'students.view', 'students.create', 'students.edit', 'students.delete',
            'teachers.view', 'teachers.create', 'teachers.edit', 'teachers.delete',
            'lessons.view', 'lessons.create', 'lessons.edit', 'lessons.delete',
            'homework.view', 'homework.create', 'homework.edit', 'homework.delete', 'homework.review',
            'exams.view', 'exams.create', 'exams.edit', 'exams.delete', 'exams.grade',
            'attendance.approve', 'attendance.reject',
            'enrollments.create', 'enrollments.delete',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }
    }
}
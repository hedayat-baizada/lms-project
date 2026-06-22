<?php

namespace Database\Seeders;

       
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [

            // Dashboard
            'dashboard.view',

            // Users
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            // Roles
            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',

            // Permissions
            'permissions.view',
            'permissions.create',
            'permissions.edit',
            'permissions.delete',

            // Applications
            'applications.view',
            'applications.create',
            'applications.edit',
            'applications.delete',
            'applications.approve',
            'applications.reject',

            // Students
            'students.view',
            'students.create',
            'students.edit',
            'students.delete',

            // Guardians
            'guardians.view',
            'guardians.create',
            'guardians.edit',
            'guardians.delete',

            // Interviews
            'interviews.view',
            'interviews.create',
            'interviews.edit',
            'interviews.delete',
            'interviews.conduct',

            // Placement Tests
            'placement-tests.view',
            'placement-tests.create',
            'placement-tests.edit',
            'placement-tests.delete',
            'placement-tests.evaluate',

            // Courses
            'courses.view',
            'courses.create',
            'courses.edit',
            'courses.delete',

            // Class Groups
            'class-groups.view',
            'class-groups.create',
            'class-groups.edit',
            'class-groups.delete',

            // Attendance
            'attendance.view',
            'attendance.create',
            'attendance.edit',
            'attendance.delete',
            'attendance.mark',

            // Result Cards
            'result-cards.view',
            'result-cards.create',
            'result-cards.edit',
            'result-cards.delete',
            'result-cards.generate',

            // Teachers
            'teachers.view',
            'teachers.create',
            'teachers.edit',
            'teachers.delete',

            // Volunteers
            'volunteers.view',
            'volunteers.create',
            'volunteers.edit',
            'volunteers.delete',

            // Programs
            'programs.view',
            'programs.create',
            'programs.edit',
            'programs.delete',

            // Announcements
            'announcements.view',
            'announcements.create',
            'announcements.edit',
            'announcements.delete',

            // Reports
            'reports.view',
            'reports.export',

            // Audit Logs
            'audit-logs.view',

            // Settings
            'settings.view',
            'settings.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Roles
        |--------------------------------------------------------------------------
        */

        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $teacher = Role::firstOrCreate(['name' => 'Teacher']);
        $student = Role::firstOrCreate(['name' => 'Student']);
        $volunteer = Role::firstOrCreate(['name' => 'Volunteer']);
        $admissionOfficer = Role::firstOrCreate(['name' => 'Admission Officer']);

        // Admin gets everything
        $admin->syncPermissions(Permission::all());

        // Teacher
        $teacher->syncPermissions([
            'dashboard.view',
            'students.view',
            'attendance.view',
            'attendance.mark',
            'courses.view',
            'class-groups.view',
            'result-cards.view',
            'result-cards.generate',
            'announcements.view',
        ]);

        // Student
        $student->syncPermissions([
            'dashboard.view',
            'courses.view',
            'attendance.view',
            'result-cards.view',
            'announcements.view',
        ]);

        // Volunteer
        $volunteer->syncPermissions([
            'dashboard.view',
            'students.view',
            'attendance.view',
            'courses.view',
        ]);

        // Admission Officer
        $admissionOfficer->syncPermissions([
            'dashboard.view',
            'applications.view',
            'applications.create',
            'applications.edit',
            'applications.approve',
            'applications.reject',
            'students.view',
            'interviews.view',
            'interviews.conduct',
            'placement-tests.view',
            'placement-tests.evaluate',
        ]);
    }
}
    


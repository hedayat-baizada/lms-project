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
            'approved-applicants.view',
            'approved-applicants.edit',

           // Approved Teachers
            'approved-teachers-applications.view',
            'approved-teachers-applications.edit',

            // Approved Staffs
            'approved-staffs-applications.view',
            'approved-staffs-applications.edit',

            // Rejected Students
            'rejected-students-applications.view',
            'rejected-students-applications.restore',

            // Rejected Team Applications
            'rejected-team-applications.view',
            'rejected-team-applications.restore',

            'team-applications.view',
            'team-applications.create',
            'team-applications.edit',
            'team-applications.delete',

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

            // Attendance (legacy/admissions module)
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

             // Teacher Attendance
            'teacher-attendance.view',
            'teacher-attendance.create',
            'teacher-attendance.edit',
            'teacher-attendance.delete',

            // Teacher Assignments
            'teacher-assignments.view',
            'teacher-assignments.create',
            'teacher-assignments.edit',
            'teacher-assignments.delete',

            // Volunteer Roles
            'volunteer-roles.view',
            'volunteer-roles.create',
            'volunteer-roles.edit',
            'volunteer-roles.delete',

            // Volunteer Attendance
            'volunteer-attendance.view',
            'volunteer-attendance.create',
            'volunteer-attendance.edit',
            'volunteer-attendance.delete',

            // Volunteer Assignments
            'volunteer-assignments.view',
            'volunteer-assignments.create',
            'volunteer-assignments.edit',
            'volunteer-assignments.delete',

            // Programs
            'programs.view',
            'programs.create',
            'programs.edit',
            'programs.delete',

            // Lesson Plans
            'lesson-plans.view',
            'lesson-plans.create',
            'lesson-plans.edit',
            'lesson-plans.delete',

            // Class Schedules
            'class-schedules.view',
            'class-schedules.create',
            'class-schedules.edit',
            'class-schedules.delete',

            // Assessments
            'assessments.view',
            'assessments.create',
            'assessments.edit',
            'assessments.delete',

            // Announcements
            'announcements.view',
            'announcements.create',
            'announcements.edit',
            'announcements.delete',

           // Reports
            'reports.view',
            'reports.export',
            'reports.students.view',
            'reports.attendance.view',
            'reports.academic.view',
            'reports.teachers.view',
            'reports.volunteers.view',
            'reports.admissions.view',
            'reports.results.view',

            // Audit Logs
            'audit-logs.view',

            // Settings
            'settings.view',
            'settings.edit',

    
            // ================================================================
            'classes.view',
            'classes.create',
            'classes.edit',
            'classes.delete',

            'lessons.view',
            'lessons.create',
            'lessons.edit',
            'lessons.delete',

            'homework.view',
            'homework.create',
            'homework.edit',
            'homework.delete',
            'homework.review',
            'homework.submit',

            'exams.view',
            'exams.create',
            'exams.edit',
            'exams.delete',
            'exams.grade',
            'exams.submit',

            'attendance.approve',
            'attendance.reject',
            'attendance.request',

            'enrollments.create',
            'enrollments.delete',
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
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admissionOfficer = Role::firstOrCreate(['name' => 'Admission Officer']);
        $teacher = Role::firstOrCreate(['name' => 'Teacher']);
        $volunteer = Role::firstOrCreate(['name' => 'Volunteer']);
        $courseManager = Role::firstOrCreate(['name' => 'Course Manager']);
        $reportManager = Role::firstOrCreate(['name' => 'Report Manager']);
        $student = Role::firstOrCreate(['name' => 'Student']);


        // Super Admin gets everything
        $superAdmin->syncPermissions(Permission::all());

        // Admin gets everything
        $admin->syncPermissions(Permission::all());


        // Admission Officer
        $admissionOfficer->syncPermissions([
            'dashboard.view',

            // Admissions
            'applications.view',
            'applications.create',
            'applications.edit',
            'applications.approve',
            'applications.reject',

            'approved-applicants.view',
            'approved-applicants.edit',

            'team-applications.view',
            'team-applications.create',
            'team-applications.edit',
            'team-applications.delete',

            'approved-staffs-applications.view',
            'approved-staffs-applications.edit',

            'approved-teachers-applications.view',
            'approved-teachers-applications.edit',

            'rejected-students-applications.view',
            'rejected-students-applications.restore',

            'rejected-team-applications.view',
            'rejected-team-applications.restore',

           
            // Volunteers
            'volunteers.view',
            'volunteer-roles.view',
            'volunteer-attendance.view',
            'volunteer-assignments.view',

            'announcements.view',
        ]);


        // Volunteer
        $volunteer->syncPermissions([
            'dashboard.view',

            'students.view',

            'courses.view',
            'class-groups.view',
            'class-schedules.view',

            'attendance.view',
            'attendance.mark',

            'lesson-plans.view',

            'assessments.view',

            'announcements.view',
        ]);

        // Course Manager
        $courseManager->syncPermissions(Permission::all());

        // Teacher
    
        $teacher->syncPermissions([
            'dashboard.view',

            // --- LMS ---
            'classes.view',
            'lessons.view',
            'lessons.create',
            'lessons.edit',
            'lessons.delete',
            'homework.view',
            'homework.create',
            'homework.edit',
            'homework.review',
            'exams.view',
            'exams.create',
            'exams.edit',
            'exams.grade',
            'attendance.approve',
            'attendance.reject',
            'enrollments.create',

             'announcements.view',
        ]);


        // Report Manager
        $reportManager->syncPermissions([
            'dashboard.view',

            'reports.view',
            'reports.export',

            'reports.students.view',
            'reports.attendance.view',
            'reports.academic.view',
            'reports.teachers.view',
            'reports.volunteers.view',
            'reports.admissions.view',
            'reports.results.view',
            'announcements.view',
        ]);

        
        $student->syncPermissions([
            'dashboard.view',

            'courses.view',
            'class-schedules.view',

            'attendance.view',

            'result-cards.view',

            'assessments.view',

            'announcements.view',

            // --- LMS ---
            'classes.view',
            'lessons.view',
            'homework.view',
            'homework.submit',
            'exams.view',
            'exams.submit',
            'attendance.request',
        ]);
    }
}
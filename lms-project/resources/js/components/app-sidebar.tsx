import { useCan } from '@/lib/can';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    Users,
    Shield,
    KeyRound,
    FileText,
    GraduationCap,
    UserRound,
    ClipboardCheck,
    FileCheck,
    BookMarked,
    Layers3,
    CalendarCheck,
    Award,
    Presentation,
    HandHelping,
    Megaphone,
    BarChart3,
    History,
    Settings,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },

    {
        title: 'User Management',
        icon: Users,
        children: [

            {
                title: 'Users',
                url: '/users',
                icon: Users,
                permission: 'users.view',
            },
            {
                title: 'Roles',
                url: '/roles',
                icon: Shield,
                permission: 'roles.view',
            },
            {
                title: 'Permissions',
                url: '/permissions',
                icon: KeyRound,
                permission: 'permissions.view',
            },
        ],
    },

    {
        title: 'Admissions',
        icon: FileText,
        children: [
            {
                title: 'Applications',
                url: '/applications',
                icon: FileText,
                permission: 'applications.view',
            },
            {
                title: 'Students',
                url: '/students',
                icon: GraduationCap,
                permission: 'students.view',
            },
            {
                title: 'Guardians',
                url: '/guardians',
                icon: UserRound,
                permission: 'guardians.view',
            },
            {
                title: 'Interviews',
                url: '/interviews',
                icon: ClipboardCheck,
                permission: 'interviews.view',
            },
            {
                title: 'Placement Tests',
                url: '/placement-tests',
                icon: FileCheck,
                permission: 'placement-tests.view',
            },
        ],
    },


    {
        title: 'Academic',
        icon: GraduationCap,
        children: [
            {
                title: 'Programs',
                url: '/programs',
                icon: BookOpen,
                permission: 'programs.view',
            },
            {
                title: 'Courses',
                url: '/courses',
                icon: BookMarked,
                permission: 'courses.view',
            },
            {
                title: 'Class Groups',
                url: '/class-groups',
                icon: Layers3,
                permission: 'class-groups.view',
            },
            {
                title: 'Student Attendance',
                url: '/attendance',
                icon: CalendarCheck,
                permission: 'attendance.view',
            },
            {
                title: 'Result Cards',
                url: '/result-cards',
                icon: Award,
                permission: 'result-cards.view',
            },
        ],
    },

    {
        title: 'Teachers',
        icon: Presentation,
        children: [
            {
                title: 'Teachers',
                url: '/teachers',
                icon: Presentation,
                permission: 'teachers.view',
            },
            {
                title: 'Teacher Attendance',
                url: '/teacher-attendance',
                icon: CalendarCheck,
                permission: 'teacher-attendance.view',
            },
            {
                title: 'Teacher Assignments',
                url: '/teacher-assignments',
                icon: BookMarked,
                permission: 'teacher-assignments.view',
            },
        ],
    },

    {
        title: 'Volunteers',
        icon: HandHelping,
        children: [
            {
                title: 'Volunteers',
                url: '/volunteers',
                icon: HandHelping,
                permission: 'volunteers.view',
            },
            {
                title: 'Volunteer Roles',
                url: '/volunteer-roles',
                icon: Shield,
                permission: 'volunteer-roles.view',
            },
            {
                title: 'Volunteer Attendance',
                url: '/volunteer-attendance',
                icon: CalendarCheck,
                permission: 'volunteer-attendance.view',
            },
            {
                title: 'Volunteer Assignments',
                url: '/volunteer-assignments',
                icon: ClipboardCheck,
                permission: 'volunteer-assignments.view',
            },
        ],
    },

    {
        title: 'Teaching Operations',
        icon: BookOpen,
        children: [
            {
                title: 'Lesson Plans',
                url: '/lesson-plans',
                icon: BookOpen,
                permission: 'lesson-plans.view',
            },
            {
                title: 'Class Schedule',
                url: '/class-schedules',
                icon: CalendarCheck,
                permission: 'class-schedules.view',
            },
            {
                title: 'Assessments',
                url: '/assessments',
                icon: FileCheck,
                permission: 'assessments.view',
            },
        ],
    },

    {
        title: 'Communication',
        icon: Megaphone,
        children: [
            {
                title: 'Announcements',
                url: '/announcements',
                icon: Megaphone,
                permission: 'announcements.view',
            },
        ],
    },

    {
        title: 'Reports',
        icon: BarChart3,
        children: [
            {
                title: 'Student Reports',
                url: '/reports/students',
                icon: GraduationCap,
                permission: 'reports.students.view',
            },
            {
                title: 'Attendance Reports',
                url: '/reports/attendance',
                icon: CalendarCheck,
                permission: 'reports.attendance.view',
            },
            {
                title: 'Academic Reports',
                url: '/reports/academic',
                icon: BookMarked,
                permission: 'reports.academic.view',
            },
            {
                title: 'Teacher Reports',
                url: '/reports/teachers',
                icon: Presentation,
                permission: 'reports.teachers.view',
            },
            {
                title: 'Volunteer Reports',
                url: '/reports/volunteers',
                icon: HandHelping,
                permission: 'reports.volunteers.view',
            },
            {
                title: 'Admission Reports',
                url: '/reports/admissions',
                icon: FileText,
                permission: 'reports.admissions.view',
            },
            {
                title: 'Result Reports',
                url: '/reports/results',
                icon: Award,
                permission: 'reports.results.view',
            },
        ],
    },


    {
        title: 'System',
        icon: Settings,
        children: [
            {
                title: 'Audit Logs',
                url: '/audit-logs',
                icon: History,
                permission: 'audit-logs',
            },
            {
                title: 'Settings',
                url: '/settings',
                icon: Settings,
                permission: 'settings',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const can = useCan();

    const filteredItems = mainNavItems
        .map(item => ({
            ...item,
            children: item.children?.filter(
                child =>
                    !child.permission ||
                    can(child.permission)
            ),
        }))
        .filter(
            item =>
                !item.children ||
                item.children.length > 0
        );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

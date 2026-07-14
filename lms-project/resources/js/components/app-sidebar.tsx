import { useCan } from '@/lib/can';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
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
    UserCheck,
    CircleUser,
    BookUser,
    Monitor,
    Calendar,
    ClipboardList,
    Trophy,
    UsersRound,
    UserX,
    UserRoundX,
} from 'lucide-react';
import AppLogo from './app-logo';

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
            {
                title: 'Approved Applicants',
                url: '/approved-applicants',
                icon: UserCheck,
                permission: 'approved-applicants.view',
            },
            {
                title: 'Approved Teachers',
                url: '/approved-teachers',
                icon: GraduationCap,
                permission: 'approved-teachers-applications.view',
            },
            {
                title: 'Approved Staffs',
                url: '/approved-staffs',
                icon: UsersRound,
                permission: 'approved-staffs-applications.view',
            },
            {
                title: 'Team Applications',
                url: '/team-applications',
                icon: Users,
                permission: 'team-applications.view',
            },

            {
                title: 'Rejected Students',
                url: '/rejected-students',
                icon: UserX,
                permission: 'rejected-students-applications.view',
            },

            {
                title: 'Rejected Team Applications',
                url: '/rejected-team-applications',
                icon: UserRoundX,
                permission: 'rejected-team-applications.view',
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
            {
                title: 'Approved Applicants',
                url: '/approved-applicants',
                icon: UserCheck,
                permission: 'approved-applicants.view',
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
                permission: 'audit-logs.view',
            },
            {
                title: 'Settings',
                url: '/settings',
                icon: Settings,
                permission: 'settings.view',
            },
        ],
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user.role as string;
    const can = useCan();

    
    const lmsNavItems: NavItem[] = (() => {
        if (role === 'admin') {
            return [
                { title: 'Classes', url: '/admin/classes', icon: GraduationCap },
                { title: 'Students', url: '/admin/students', icon: Users },
                { title: 'Teachers', url: '/admin/teachers', icon: Monitor },
            ];
        } else if (role === 'teacher') {
            return [
                { title: 'My Classes', url: '/teacher/classes', icon: GraduationCap },
                { title: 'Homework', url: '/teacher/homework', icon: BookOpen },
                { title: 'Attendance', url: '/teacher/attendance', icon: Calendar },
                { title: 'Exams', url: '/teacher/exams', icon: ClipboardList },
            ];
        } else if (role === 'student') {
            return [
                { title: 'My Classes', url: '/student/classes', icon: GraduationCap },
                { title: 'My Results', url: '/student/results', icon: Trophy },
            ];
        }
        return [];
    })();

    const filteredTeamItems = mainNavItems
        .map(item => ({
            ...item,
            children: item.children?.filter(
                child => !child.permission || can(child.permission)
            ),
        }))
        .filter(item => !item.children || item.children.length > 0);

    const allNavItems = [...filteredTeamItems];

    if (lmsNavItems.length > 0) {
        allNavItems.push({
            title: 'My LMS',
            icon: BookOpen,
            children: lmsNavItems,
        });
    }

    return (
        <Sidebar 
            collapsible="icon" 
            variant="inset"
            
            className="bg-gradient-to-b from-slate-50/90 via-white/90 to-indigo-50/80 backdrop-blur-md border-r border-white/50 shadow-xl shadow-indigo-200/20"
        >
            <SidebarHeader className="relative border-b border-indigo-100/50 pb-4">
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 opacity-20 blur-3xl pointer-events-none"></div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            asChild
                            className="hover:bg-white/50 transition-all duration-200 data-[state=open]:bg-white/50 rounded-xl"
                        >
                            <Link href="/dashboard" prefetch className="group flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-200 transition-transform group-hover:scale-105 group-hover:shadow-indigo-300">
                                    <GraduationCap className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">
                                    EduPortal
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-4">
                <div className="space-y-1">
                    <NavMain items={allNavItems} />
                </div>
            </SidebarContent>

            <SidebarFooter className="relative border-t border-indigo-100/50 pt-4">
                <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-tr from-purple-300 to-pink-300 opacity-20 blur-3xl pointer-events-none"></div>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <div className="mt-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm transition-all hover:shadow-md hover:bg-white/60 p-1">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
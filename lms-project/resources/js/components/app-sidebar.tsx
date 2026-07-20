import { useCan } from '@/lib/can';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
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
                title: 'Rejected Team',
                url: '/rejected-team-applications',
                icon: UserRoundX,
                permission: 'rejected-team-applications.view',
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
    const can = useCan();
    const { state } = useSidebar(); // get current sidebar state
    const roles: string[] = (auth.user?.roles as string[]) ?? [];
    const isSuperAdmin = roles.includes('Super Admin');
    const isAdmin = roles.includes('Admin') || isSuperAdmin;
    const isTeacher = roles.includes('Teacher');
    const isStudent = roles.includes('Student') || roles.length === 0;

    const lmsNavItems: NavItem[] = [];

    if (isAdmin) {
        lmsNavItems.push(
            { title: 'Classes', url: '/admin/classes', icon: GraduationCap },
            { title: 'Students', url: '/admin/students', icon: Users },
            { title: 'Teachers', url: '/admin/teachers', icon: Monitor }
        );
    } else if (isTeacher) {
        if (can('classes.view')) {
            lmsNavItems.push({
                title: 'My Classes',
                url: '/teacher/classes',
                icon: GraduationCap,
            });
        }

        if (can('homework.view')) {
            lmsNavItems.push({
                title: 'Homework',
                url: '/teacher/homework',
                icon: BookOpen,
            });
        }

        if (can('attendance.approve')) {
            lmsNavItems.push({
                title: 'Attendance',
                url: '/teacher/attendance',
                icon: Calendar,
            });
        }

        if (can('exams.view')) {
            lmsNavItems.push({
                title: 'Exams',
                url: '/teacher/exams',
                icon: ClipboardList,
            });
        }
    } else if (isStudent) {
        if (can('classes.view')) {
            lmsNavItems.push({
                title: 'My Classes',
                url: '/student/classes',
                icon: GraduationCap,
            });
        }

        if (can('result-cards.view')) {
            lmsNavItems.push({
                title: 'My Results',
                url: '/student/results',
                icon: Trophy,
            });
        }
    }

    let filteredTeamItems: NavItem[] = [];

    if (isTeacher) {
        // Teacher only sees Dashboard
        filteredTeamItems = mainNavItems.filter(
            item => item.title === 'Dashboard'
        );
    } else {
        filteredTeamItems = mainNavItems
            .map(item => ({
                ...item,
                children: item.children?.filter(child => {
                    if (isAdmin) return true;
                    return !child.permission || can(child.permission);
                }),
            }))
            .filter(item => !item.children || item.children.length > 0);
    }

    const allNavItems = [...filteredTeamItems];

    if (lmsNavItems.length > 0) {
        allNavItems.push({
            title: 'My LMS',
            icon: BookOpen,
            children: lmsNavItems,
        });
    }

    const isCollapsed = state === 'collapsed';

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
                            <Link href="/dashboard" prefetch className="group flex items-center justify-center gap-3 py-2">
                                {/* Conditional logo based on sidebar state */}
                                {isCollapsed ? (
                                    // Small icon when collapsed
                                    <div className="flex items-center justify-center">
                                        <img 
                                            src="/images/logo.png" 
                                            alt="Alpha Academy"
                                            className="h-8 w-auto object-contain"
                                        />
                                    </div>
                                ) : (
                                    // Full text logo when expanded
                                    <div className="flex items-center justify-center">
                                        <img 
                                            src="/images/logo_text1.png" 
                                            alt="Alpha Academy"
                                            className="h-15 w-auto object-contain"
                                        />
                                    </div>
                                )}
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
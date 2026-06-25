// import { useCan } from '@/lib/can';
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
    CircleUser,
    BookUser, 
    
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
            },
            {
                title: 'Roles',
                url: '/roles',
                icon: Shield,
            },
            {
                title: 'Permissions',
                url: '/permissions',
                icon: KeyRound,
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
            },
            {
                title: 'Students',
                url: '/students',
                icon: GraduationCap,
            },
            {
                title: 'Guardians',
                url: '/guardians',
                icon: UserRound,
            },
            {
                title: 'Interviews',
                url: '/interviews',
                icon: ClipboardCheck,
            },
            {
                title: 'Placement Tests',
                url: '/placement-tests',
                icon: FileCheck,
            },
        ],
    },

    {
        title: 'Academic',
        icon: GraduationCap,
        children: [
            {
                title: 'Courses',
                url: '/courses',
                icon: BookMarked,
            },
            {
                title: 'Class Groups',
                url: '/class-groups',
                icon: Layers3,
            },
            {
                title: 'Attendance',
                url: '/attendance',
                icon: CalendarCheck,
            },
            {
                title: 'Result Cards',
                url: '/result-cards',
                icon: Award,
            },
        ],
    },

    {
        title: 'Teacher',
        icon: CircleUser,
        children: [
            {
                title: 'Attendance',
                url: '/teachers/attendance',
                icon: BookUser,
            },
            // {
            //     title: 'Volunteers',
            //     url: '/volunteers',
            //     icon: HandHelping,
            // },
            // {
            //     title: 'Programs',
            //     url: '/programs',
            //     icon: BookOpen,
            // },
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
                icon: BarChart3,
            },
            {
                title: 'Attendance Reports',
                url: '/reports/attendance',
                icon: CalendarCheck,
            },
            {
                title: 'Academic Reports',
                url: '/reports/academic',
                icon: BookMarked,
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
            },
            {
                title: 'Settings',
                url: '/settings',
                icon: Settings,
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
    // const can = useCan();
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

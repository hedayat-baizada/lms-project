import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    UserCheck,
    Shield,
    KeyRound,
    UserPlus,
    PlusCircle,
    Activity,
} from 'lucide-react';

type Props = {
    stats: {
        users: number;
        activeUsers: number;
        roles: number;
        permissions: number;
    };

    recentUsers: {
        id: number;
        name: string;
        email: string;
        created_at: string;
    }[];
};

export default function Dashboard({
    stats,
    recentUsers,
}: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="p-6 space-y-6">

                {/* PAGE HEADER */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Dashboard
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        AES Administration Panel
                    </p>
                </div>

                {/* WELCOME + QUICK ACTIONS */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* WELCOME */}
                    <div className="lg:col-span-2 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">

                        <h2 className="text-3xl font-bold">
                            Welcome Back 👋
                        </h2>

                        <p className="mt-3 text-blue-100">
                            Alpha Educational Society (AES)
                        </p>

                        <p className="mt-2 text-sm text-blue-200">
                            Refugee Education Management System
                        </p>

                        <div className="mt-6 flex items-center gap-2 text-sm">
                            <Activity size={18} />
                            Manage users, roles, permissions and educational operations.
                        </div>

                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

                        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                            Quick Actions
                        </h2>

                        <div className="space-y-3">

                            <Link
                                href={route('users.create')}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700"
                            >
                                <UserPlus size={18} />
                                Add User
                            </Link>

                            <Link
                                href={route('roles.create')}
                                className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-white transition hover:bg-green-700"
                            >
                                <PlusCircle size={18} />
                                Add Role
                            </Link>

                            <Link
                                href={route('users.index')}
                                className="flex items-center gap-2 rounded-xl border px-4 py-3 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Users size={18} />
                                View Users
                            </Link>

                            <Link
                                href={route('roles.index')}
                                className="flex items-center gap-2 rounded-xl border px-4 py-3 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Shield size={18} />
                                View Roles
                            </Link>

                        </div>

                    </div>

                </div>

                {/* STATISTICS */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                    {/* USERS */}
                    <div className="rounded-3xl border border-t-4 border-t-blue-500 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">

                        <div className="flex items-center justify-between">
                            <p className="text-slate-500">
                                Total Users
                            </p>

                            <Users className="text-blue-500" />
                        </div>

                        <h2 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
                            {stats.users}
                        </h2>

                    </div>

                    {/* ACTIVE USERS */}
                    <div className="rounded-3xl border border-t-4 border-t-green-500 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">

                        <div className="flex items-center justify-between">
                            <p className="text-slate-500">
                                Active Users
                            </p>

                            <UserCheck className="text-green-500" />
                        </div>

                        <h2 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
                            {stats.activeUsers}
                        </h2>

                    </div>

                    {/* ROLES */}
                    <div className="rounded-3xl border border-t-4 border-t-purple-500 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">

                        <div className="flex items-center justify-between">
                            <p className="text-slate-500">
                                Roles
                            </p>

                            <Shield className="text-purple-500" />
                        </div>

                        <h2 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
                            {stats.roles}
                        </h2>

                    </div>

                    {/* PERMISSIONS */}
                    <div className="rounded-3xl border border-t-4 border-t-orange-500 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">

                        <div className="flex items-center justify-between">
                            <p className="text-slate-500">
                                Permissions
                            </p>

                            <KeyRound className="text-orange-500" />
                        </div>

                        <h2 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
                            {stats.permissions}
                        </h2>

                    </div>

                </div>

                {/* RECENT USERS */}
                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                    <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Recent Users
                        </h2>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-100 dark:bg-slate-800">

                                <tr>
                                    <th className="p-4 text-left">
                                        Name
                                    </th>

                                    <th className="p-4 text-left">
                                        Email
                                    </th>

                                    <th className="p-4 text-left">
                                        Joined
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {recentUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                    >
                                        <td className="p-4 font-medium">
                                            {user.name}
                                        </td>

                                        <td className="p-4">
                                            {user.email}
                                        </td>

                                        <td className="p-4">
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
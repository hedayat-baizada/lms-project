import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useCan } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    email_verified_at: string | null;
    status: boolean;
    last_login_at: string | null;
    created_at: string;
    roles?: {
        id: number;
        name: string;
    }[];
};

type Props = {
    users: {
        data: User[];
    };
};

export default function Index({ users }: Props) {
    const can = useCan();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                    >
                        ← Back
                    </button>

                    <h1 className="text-xl font-bold">
                        Users
                    </h1>

                    {/* ADD USER BUTTON */}
                    {can('users.create') && <Link
                        href={route('users.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                        + Add User
                    </Link>}
                </div>

                {/* TABLE */}
                <table className="min-w-full border bg-white text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Email Verified</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Last Login</th>
                            <th className="p-3">Created At</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users?.data?.length ? (
                            users.data.map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50">

                                    <td className="p-3">{user.id}</td>

                                    <td className="p-3 font-medium">
                                        {user.name}
                                    </td>

                                    <td className="p-3">
                                        {user.email}
                                    </td>


                                    <td className="p-3">
                                        {user.roles?.length ? (
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role) => (
                                                    <span
                                                        key={role.id}
                                                        className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700"
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">
                                                No Role
                                            </span>
                                        )}
                                    </td>


                                    <td className="p-3">
                                        {user.phone ?? '-'}
                                    </td>

                                    <td className="p-3">
                                        {user.email_verified_at ? (
                                            <span className="text-green-600 text-xs">
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="text-red-500 text-xs">
                                                Not Verified
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3">
                                        {user.status ? (
                                            <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3">
                                        {user.last_login_at ?? 'Never'}
                                    </td>

                                    <td className="p-3">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>

                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">

                                            {/* VIEW */}
                                            {can('roles.view') && <Link
                                                href={route('users.show', user.id)}
                                                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                View
                                            </Link>}

                                            {/* EDIT */}
                                            {can('users.edit') && <Link
                                                href={route('users.edit', user.id)}
                                                className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </Link>}

                                            {/* DELETE */}
                                            {can('users.delete') && <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this user?')) {
                                                        router.delete(route('users.destroy', user.id));
                                                    }
                                                }}
                                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>}

                                        </div>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="p-4 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
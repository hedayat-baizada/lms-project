import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useCan } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

type Role = {
    id: number;
    name: string;
    permissions_count?: number;
    created_at: string;
};

type Props = {
    roles: {
        data: Role[];
    };
};

export default function Index({ roles }: Props) {
    const can = useCan();
    const deleteRole = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', id));
        }
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                        >
                            ← Back
                        </button>

                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Roles Management
                        </h1>
                        <p className="text-gray-500">
                            Manage system roles and permissions
                        </p>



                    </div>


                    {can('roles.create') && <Link
                        href={route('roles.create')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        + Add Role
                    </Link>}
                </div>

                {/* Table */}
                <div className="bg-white border rounded-lg overflow-hidden">

                    <table className="min-w-full text-sm">

                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Role Name</th>
                                <th className="p-3 text-left">Permissions</th>
                                <th className="p-3 text-left">Created</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {roles?.data?.length ? (
                                roles.data.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-3">
                                            {role.id}
                                        </td>

                                        <td className="p-3 font-medium">
                                            {role.name}
                                        </td>

                                        <td className="p-3">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                                {role.permissions_count ?? 0} Permissions
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            {new Date(
                                                role.created_at
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">

                                                {can('roles.view') && <Link
                                                    href={route(
                                                        'roles.show',
                                                        role.id
                                                    )}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                                >
                                                    View
                                                </Link>}

                                                {can('roles.edit') && <Link
                                                    href={route(
                                                        'roles.edit',
                                                        role.id
                                                    )}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                                                >
                                                    Edit
                                                </Link>}

                                                {can('roles.delete') && <button
                                                    onClick={() =>
                                                        deleteRole(role.id)
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                                                >
                                                    Delete
                                                </button>}

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No roles found
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>

                </div>

            </div>
        </AppLayout>
    );


}

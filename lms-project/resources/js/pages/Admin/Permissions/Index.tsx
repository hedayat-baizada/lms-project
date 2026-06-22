import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

type Permission = {
    id: number;
    name: string;
};

export default function Index({
    permissions,
}: {
    permissions: Permission[];
}) {
    const destroy = (id: number) => {
        if (confirm('Delete permission?')) {
            router.delete(route('permissions.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Permissions" />

            <div className="p-6">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">
                        Permissions
                    </h1>

                    <Link
                        href={route('permissions.create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Create
                    </Link>
                </div>

                <table className="w-full border">
                    <thead>
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {permissions.map((permission) => (
                            <tr key={permission.id}>
                                <td className="border p-2">
                                    {permission.id}
                                </td>

                                <td className="border p-2">
                                    {permission.name}
                                </td>

                                <td className="border p-2 space-x-2">
                                    <Link
                                        href={route(
                                            'permissions.show',
                                            permission.id
                                        )}
                                    >
                                        Show
                                    </Link>

                                    <Link
                                        href={route(
                                            'permissions.edit',
                                            permission.id
                                        )}
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() =>
                                            destroy(permission.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

type Permission = {
    id: number;
    name: string;
};

type Role = {
    id: number;
    name: string;
    permissions: Permission[];
    created_at?: string;
};

type Props = {
    role: Role;
};

export default function Show({ role }: Props) {
    return (
        <AppLayout>
            <Head title={`Role - ${role.name}`} />

            <div className="p-6 max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {role.name}
                        </h1>

                        <p className="text-gray-500">
                            Role Details & Permissions
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={route('roles.edit', role.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                            Edit Role
                        </Link>

                        <Link
                            href={route('roles.index')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                        >
                            Back
                        </Link>
                    </div>
                </div>

                {/* Role Summary Card */}
                <div className="bg-white rounded-lg border p-6 mb-6">

                    <h2 className="text-lg font-semibold mb-4">
                        Role Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div>
                            <p className="text-gray-500 text-sm">
                                Role Name
                            </p>

                            <p className="font-semibold">
                                {role.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Total Permissions
                            </p>

                            <p className="font-semibold text-blue-600">
                                {role.permissions.length}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Status
                            </p>

                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                                Active
                            </span>
                        </div>

                    </div>
                </div>

                {/* Permissions Card */}
                <div className="bg-white rounded-lg border p-6">

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Assigned Permissions
                        </h2>

                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {role.permissions.length} Permissions
                        </span>
                    </div>

                    {role.permissions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">

                            {role.permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="border rounded-lg px-3 py-2 bg-gray-50"
                                >
                                    <span className="text-sm">
                                        ✓ {permission.name}
                                    </span>
                                </div>
                            ))}

                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No permissions assigned to this role.
                        </div>
                    )}

                </div>

            </div>
        </AppLayout>
    );
}
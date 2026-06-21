import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

type Permission = {
    id: number;
    name: string;
};

type Props = {
    permissions: Permission[];
};

export default function Create({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as number[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    const togglePermission = (id: number) => {
        if (data.permissions.includes(id)) {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== id)
            );
        } else {
            setData('permissions', [...data.permissions, id]);
        }
    };

    return (
        <AppLayout>
            <Head title="Create Role" />

            <div className="max-w-5xl mx-auto p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Create Role
                        </h1>
                        <p className="text-gray-500">
                            Create a new role and assign permissions
                        </p>
                    </div>

                    <Link
                        href={route('roles.index')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                        Back
                    </Link>
                </div>

                <div className="bg-white border rounded-lg p-6">

                    <form onSubmit={submit}>

                        {/* Role Name */}
                        <div className="mb-6">
                            <label className="block mb-2 font-medium">
                                Role Name
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="w-full border rounded-lg p-3"
                                placeholder="Enter role name"
                            />

                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Permissions */}
                        <div className="mb-6">

                            <label className="block mb-3 font-medium">
                                Permissions
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

                                {permissions.map((permission) => (
                                    <label
                                        key={permission.id}
                                        className="flex items-center gap-2 border rounded-lg p-3 hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.includes(permission.id)}
                                            onChange={() =>
                                                togglePermission(permission.id)
                                            }
                                        />

                                        <span className="text-sm">
                                            {permission.name}
                                        </span>
                                    </label>
                                ))}

                            </div>

                            {errors.permissions && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.permissions}
                                </p>
                            )}

                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">

                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
                            >
                                Create Role
                            </button>

                            <Link
                                href={route('roles.index')}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded"
                            >
                                Cancel
                            </Link>

                        </div>

                    </form>

                </div>
            </div>
        </AppLayout>
    );
}
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

type Permission = {
    id: number;
    name: string;
};

type Role = {
    id: number;
    name: string;
    permissions: Permission[];
};

type Props = {
    role: Role;
    permissions: Permission[];
};

export default function Edit({ role, permissions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions.map((p) => p.id),
    });


    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('roles.update', role.id));
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
            <Head title="Edit Role" />

            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white border rounded-lg p-6">

                    <h1 className="text-2xl font-bold mb-6">
                        Edit Role
                    </h1>

                    <form onSubmit={submit}>

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
                                className="w-full border rounded p-2"
                            />

                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block mb-3 font-medium">
                                Permissions
                            </label>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {permissions.map((permission) => (
                                    <label
                                        key={permission.id}
                                        className="flex items-center gap-2 border rounded p-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.includes(permission.id)}
                                            onChange={() =>
                                                togglePermission(permission.id)
                                            }
                                        />

                                        {permission.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Update Role
                            </button>

                            <Link
                                href={route('roles.index')}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Back
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );


}

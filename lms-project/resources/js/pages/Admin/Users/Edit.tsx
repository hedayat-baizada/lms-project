import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';


type Role = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: boolean;
    roles: string[];
};
type Props = {
    user: User;
    roles: Role[];
};

export default function Edit({ user, roles }: Props) {


    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        roles: user.roles || [],
        status: user.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AppLayout>
            <Head title="Edit User" />

            <div className="p-6 max-w-2xl mx-auto">

                <h1 className="text-2xl font-bold mb-6">
                    Edit User
                </h1>

                <form
                    onSubmit={submit}
                    className="bg-white border p-6 rounded-lg space-y-4"
                >

                    {/* NAME */}
                    <div>
                        <label className="text-sm">Name</label>
                        <input
                            className="w-full border p-2 rounded mt-1"
                            value={data.name}
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm">Email</label>
                        <input
                            className="w-full border p-2 rounded mt-1"
                            value={data.email}
                            onChange={(e) =>
                                setData('email', e.target.value)
                            }
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* PHONE */}
                    <div>
                        <label className="text-sm">Phone</label>
                        <input
                            className="w-full border p-2 rounded mt-1"
                            value={data.phone}
                            onChange={(e) =>
                                setData('phone', e.target.value)
                            }
                        />
                    </div>

                    {/* ROLES */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Roles
                        </label>

                        <div className="grid grid-cols-2 gap-3 border rounded-lg p-4">

                            {roles.map((role) => (
                                <label
                                    key={role.id}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.roles.includes(role.name)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setData('roles', [
                                                    ...data.roles,
                                                    role.name,
                                                ]);
                                            } else {
                                                setData(
                                                    'roles',
                                                    data.roles.filter(
                                                        (r) => r !== role.name
                                                    )
                                                );
                                            }
                                        }}
                                    />

                                    <span>{role.name}</span>
                                </label>
                            ))}

                        </div>

                        {errors.roles && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.roles}
                            </p>
                        )}
                    </div>

                    {/* STATUS */}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.status}
                            onChange={(e) =>
                                setData('status', e.target.checked)
                            }
                        />
                        Active User
                    </label>

                    {/* BUTTONS */}
                    <div className="flex gap-2 pt-4">

                        <button
                            disabled={processing}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            {processing ? 'Updating...' : 'Update'}
                        </button>

                        <Link
                            href={route('users.index')}
                            className="bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </Link>

                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
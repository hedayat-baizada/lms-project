import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

type UserForm = {
    name: string;
    email: string;
    phone: string;
    roles: string[];
    status: boolean;
    password: string;
    password_confirmation: string;
};
type Role = {
    id: number;
    name: string;
};

type Props = {
    roles: Role[];
};
export default function Create({ roles }: Props) {
    const { data, setData, post, processing, errors } =
        useForm<UserForm>({
            name: '',
            email: '',
            phone: '',
            roles: [],
            status: true,
            password: '',
            password_confirmation: '',
        });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AppLayout>
            <Head title="Create User" />

            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Create User
                </h1>

                <form
                    onSubmit={submit}
                    className="space-y-4 bg-white p-6 rounded-lg border"
                >
                    {/* NAME */}
                    <div>
                        <label className="text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
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
                        <label className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
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
                        <label className="text-sm font-medium">
                            Phone
                        </label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded mt-1"
                            value={data.phone}
                            onChange={(e) =>
                                setData('phone', e.target.value)
                            }
                        />
                    </div>

                    {/* ROLE */}
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

                    {/* PASSWORD */}
                    <div>
                        <label className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded mt-1"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <label className="text-sm font-medium">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded mt-1"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData(
                                    'password_confirmation',
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {processing ? 'Creating...' : 'Create User'}
                    </button>

                    {/* BACK BUTTON */}
                    <Link
                        href={route('users.index')}
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Back
                    </Link>
                </form>
            </div>
        </AppLayout>
    );
}
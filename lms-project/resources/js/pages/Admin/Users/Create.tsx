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

            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Create User
                </h1>

                <form
                    onSubmit={submit}
                    className="rounded-3xl border bg-card shadow-sm p-8"
                >
                    <div className="grid gap-8 xl:grid-cols-3">

                        {/* LEFT SIDE */}
                        <div className="xl:col-span-2 space-y-6">

                            {/* BASIC INFO */}
                            <div className="rounded-2xl border p-6">
                                <h2 className="mb-4 text-lg font-semibold">
                                    Basic Information
                                </h2>

                                <div className="grid gap-4 md:grid-cols-2">

                                    {/* NAME */}
                                    <div>
                                        <label className="text-sm font-medium">
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            className="mt-1 w-full rounded-lg border p-3"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                        />
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <label className="text-sm font-medium">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            className="mt-1 w-full rounded-lg border p-3"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                        />
                                    </div>

                                    {/* PHONE */}
                                    <div>
                                        <label className="text-sm font-medium">
                                            Phone
                                        </label>

                                        <input
                                            type="text"
                                            className="mt-1 w-full rounded-lg border p-3"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                        />
                                    </div>

                                    {/* STATUS */}
                                    <div className="flex items-end">
                                        <label className="flex w-full items-center gap-3 rounded-lg border p-3">
                                            <input
                                                type="checkbox"
                                                checked={data.status}
                                                onChange={(e) =>
                                                    setData('status', e.target.checked)
                                                }
                                            />
                                            Active User
                                        </label>
                                    </div>

                                </div>
                            </div>

                            {/* ROLES */}
                            <div className="rounded-2xl border p-6">
                                <h2 className="mb-4 text-lg font-semibold">
                                    Roles
                                </h2>

                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

                                    {roles.map((role) => (
                                        <label
                                            key={role.id}
                                            className="
                            flex items-center gap-3
                            rounded-xl border p-3
                            hover:bg-muted/50
                            cursor-pointer
                        "
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

                                            {role.name}
                                        </label>
                                    ))}

                                </div>
                            </div>

                        </div>

                        {/* RIGHT SIDE */}
                        <div>

                            <div className="rounded-2xl border p-6 sticky top-6">

                                <h2 className="mb-4 text-lg font-semibold">
                                    Security
                                </h2>

                                <div className="space-y-4">

                                    <div>
                                        <label className="text-sm font-medium">
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            className="mt-1 w-full rounded-lg border p-3"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData('password', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">
                                            Confirm Password
                                        </label>

                                        <input
                                            type="password"
                                            className="mt-1 w-full rounded-lg border p-3"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="pt-4 space-y-3">

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="
                            w-full
                            rounded-xl
                            bg-blue-600
                            px-4
                            py-3
                            text-white
                            font-medium
                        "
                                        >
                                            {processing
                                                ? 'Creating...'
                                                : 'Create User'}
                                        </button>

                                        <Link
                                            href={route('users.index')}
                                            className="
                            block
                            w-full
                            rounded-xl
                            border
                            px-4
                            py-3
                            text-center
                        "
                                        >
                                            Back
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div> {/* End grid */}

                </form>

            </div>

        </AppLayout>
    );
}
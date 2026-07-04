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

            <div className="p-6 max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit User
                        </h1>

                        <p className="text-muted-foreground">
                            Update user information, roles and account status.
                        </p>
                    </div>

                    <Link
                        href={route('users.index')}
                        className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted transition"
                    >
                        ← Back
                    </Link>

                </div>

                <form
                    onSubmit={submit}
                    className="rounded-3xl border bg-card shadow-sm p-6"
                >

                    <div className="grid gap-8 xl:grid-cols-3">

                        {/* LEFT SIDE */}
                        <div className="xl:col-span-2 space-y-6">

                            {/* USER INFO */}
                            <div className="rounded-2xl border p-6">

                                <h2 className="mb-5 text-lg font-semibold">
                                    User Information
                                </h2>

                                <div className="grid gap-4 md:grid-cols-2">

                                    {/* NAME */}
                                    <div>
                                        <label className="text-sm font-medium">
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="mt-1 w-full rounded-lg border p-3"
                                        />

                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-500">
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
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="mt-1 w-full rounded-lg border p-3"
                                        />

                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-500">
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
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className="mt-1 w-full rounded-lg border p-3"
                                        />
                                    </div>

                                    {/* STATUS */}
                                    <div className="flex items-end">

                                        <label className="flex w-full items-center gap-3 rounded-xl border p-3">

                                            <input
                                                type="checkbox"
                                                checked={data.status}
                                                onChange={(e) =>
                                                    setData(
                                                        'status',
                                                        e.target.checked
                                                    )
                                                }
                                            />

                                            <span className="font-medium">
                                                Active User
                                            </span>

                                        </label>

                                    </div>

                                </div>

                            </div>

                            {/* ROLES */}
                            <div className="rounded-2xl border p-6">

                                <h2 className="mb-5 text-lg font-semibold">
                                    Roles & Permissions
                                </h2>

                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

                                    {roles.map((role) => (
                                        <label
                                            key={role.id}
                                            className="
                                                flex items-center gap-3
                                                rounded-xl border p-3
                                                cursor-pointer
                                                transition
                                                hover:bg-muted/50
                                                hover:border-primary
                                            "
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.roles.includes(
                                                    role.name
                                                )}
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
                                                                (r) =>
                                                                    r !==
                                                                    role.name
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
                                    <p className="mt-3 text-sm text-red-500">
                                        {errors.roles}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* RIGHT SIDE */}
                        <div>

                            <div className="sticky top-6 rounded-2xl border p-6">

                                <h2 className="mb-5 text-lg font-semibold">
                                    Account Actions
                                </h2>

                                <div className="space-y-4">

                                    <div className="rounded-xl border p-4 bg-muted/30">
                                        <p className="text-sm text-muted-foreground">
                                            User Status
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {data.status
                                                ? 'Active'
                                                : 'Inactive'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border p-4 bg-muted/30">
                                        <p className="text-sm text-muted-foreground">
                                            Assigned Roles
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {data.roles.length}
                                        </p>
                                    </div>

                                    <div className="pt-4 space-y-3">

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="
                                                w-full
                                                rounded-xl
                                                bg-green-600
                                                px-4
                                                py-3
                                                font-medium
                                                text-white
                                                hover:bg-green-700
                                            "
                                        >
                                            {processing
                                                ? 'Updating...'
                                                : 'Update User'}
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
                                                font-medium
                                                hover:bg-muted
                                            "
                                        >
                                            Cancel
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </form>

            </div>
        </AppLayout>
    );
}
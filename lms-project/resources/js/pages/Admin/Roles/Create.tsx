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

            <div className="max-w-7xl mx-auto p-6">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create Role
                        </h1>

                        <p className="text-muted-foreground">
                            Create a new role and assign permissions.
                        </p>
                    </div>

                    <Link
                        href={route('roles.index')}
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

                            {/* ROLE INFO */}
                            <div className="rounded-2xl border p-6">

                                <h2 className="mb-5 text-lg font-semibold">
                                    Role Information
                                </h2>

                                <div>
                                    <label className="block mb-2 text-sm font-medium">
                                        Role Name
                                    </label>

                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-xl border p-3"
                                        placeholder="Enter role name"
                                    />

                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* PERMISSIONS */}
                            <div className="rounded-2xl border p-6">

                                <div className="mb-5 flex items-center justify-between">

                                    <h2 className="text-lg font-semibold">
                                        Permissions
                                    </h2>

                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                        {data.permissions.length} Selected
                                    </span>

                                </div>

                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

                                    {permissions.map((permission) => (
                                        <label
                                            key={permission.id}
                                            className="
                                                flex items-center gap-3
                                                rounded-xl border p-3
                                                cursor-pointer
                                                transition-all
                                                hover:bg-muted/50
                                                hover:border-primary
                                                hover:shadow-sm
                                            "
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.permissions.includes(
                                                    permission.id
                                                )}
                                                onChange={() =>
                                                    togglePermission(
                                                        permission.id
                                                    )
                                                }
                                            />

                                            <span className="text-sm">
                                                {permission.name}
                                            </span>

                                        </label>
                                    ))}

                                </div>

                                {errors.permissions && (
                                    <p className="mt-3 text-sm text-red-500">
                                        {errors.permissions}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* RIGHT SIDE */}
                        <div>

                            <div className="sticky top-6 rounded-2xl border p-6">

                                <h2 className="mb-5 text-lg font-semibold">
                                    Actions
                                </h2>

                                <div className="space-y-4">

                                    <div className="rounded-xl border bg-muted/30 p-4">

                                        <p className="text-sm text-muted-foreground">
                                            Selected Permissions
                                        </p>

                                        <p className="mt-1 text-3xl font-bold">
                                            {data.permissions.length}
                                        </p>

                                    </div>

                                    <div className="rounded-xl border bg-muted/30 p-4">

                                        <p className="text-sm text-muted-foreground">
                                            Role Name
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {data.name || 'Not specified'}
                                        </p>

                                    </div>

                                    <div className="pt-2 space-y-3">

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="
                                                w-full
                                                rounded-xl
                                                bg-blue-600
                                                px-4
                                                py-3
                                                font-medium
                                                text-white
                                                transition
                                                hover:bg-blue-700
                                            "
                                        >
                                            {processing
                                                ? 'Creating...'
                                                : 'Create Role'}
                                        </button>

                                        <Link
                                            href={route('roles.index')}
                                            className="
                                                block
                                                w-full
                                                rounded-xl
                                                border
                                                px-4
                                                py-3
                                                text-center
                                                font-medium
                                                transition
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
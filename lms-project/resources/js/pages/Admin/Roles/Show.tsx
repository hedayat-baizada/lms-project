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

            <div className="mx-auto max-w-7xl p-6 space-y-6">

                {/* HERO HEADER */}
                <div className="rounded-3xl border bg-card p-6 shadow-sm">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {role.name}
                            </h1>

                            <p className="text-muted-foreground mt-1">
                                View role information and assigned permissions.
                            </p>
                        </div>

                        <div className="flex gap-3">

                            <Link
                                href={route('roles.edit', role.id)}
                                className="
                                    rounded-xl
                                    bg-yellow-500
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-yellow-600
                                "
                            >
                                Edit Role
                            </Link>

                            <Link
                                href={route('roles.index')}
                                className="
                                    rounded-xl
                                    border
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-medium
                                    transition
                                    hover:bg-muted
                                "
                            >
                                Back
                            </Link>

                        </div>

                    </div>

                </div>

                {/* STATS */}
                <div className="grid gap-4 md:grid-cols-3">

                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Role Name
                        </p>

                        <p className="mt-2 text-xl font-bold">
                            {role.name}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Total Permissions
                        </p>

                        <p className="mt-2 text-xl font-bold text-blue-600">
                            {role.permissions.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Status
                        </p>

                        <span
                            className="
                                mt-2 inline-flex
                                rounded-full
                                bg-green-100
                                px-3
                                py-1
                                text-sm
                                font-medium
                                text-green-700
                            "
                        >
                            Active
                        </span>
                    </div>

                </div>

                {/* PERMISSIONS */}
                <div className="rounded-3xl border bg-card shadow-sm">

                    <div className="flex items-center justify-between border-b px-6 py-4">

                        <div>
                            <h2 className="font-semibold text-lg">
                                Assigned Permissions
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Permissions available for this role
                            </p>
                        </div>

                        <span
                            className="
                                rounded-full
                                bg-blue-100
                                px-3
                                py-1
                                text-sm
                                font-medium
                                text-blue-700
                            "
                        >
                            {role.permissions.length} Permissions
                        </span>

                    </div>

                    <div className="p-6">

                        {role.permissions.length > 0 ? (

                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

                                {role.permissions.map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="
                                            rounded-xl
                                            border
                                            bg-muted/30
                                            px-4
                                            py-3
                                            transition
                                            hover:border-primary
                                            hover:shadow-sm
                                        "
                                    >
                                        <span className="text-sm font-medium">
                                            ✓ {permission.name}
                                        </span>
                                    </div>
                                ))}

                            </div>

                        ) : (

                            <div className="py-12 text-center">

                                <p className="text-muted-foreground">
                                    No permissions assigned to this role.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
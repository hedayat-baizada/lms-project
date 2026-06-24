import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    email_verified_at: string | null;
    status: boolean;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    user: User;
};

export default function Show({ user }: Props) {
    return (
        <AppLayout>
            <Head title="User Details" />

            <div className="mx-auto max-w-7xl p-6 space-y-6">

                {/* HERO HEADER */}
                <div className="rounded-3xl border bg-card p-6 shadow-sm">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {user.name}
                            </h1>

                            <p className="mt-1 text-muted-foreground">
                                User profile and account information.
                            </p>
                        </div>

                        <div className="flex gap-3">

                            <Link
                                href={route('users.edit', user.id)}
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
                                Edit User
                            </Link>

                            <Link
                                href={route('users.index')}
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

                {/* SUMMARY CARDS */}
                <div className="grid gap-4 md:grid-cols-4">

                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            User ID
                        </p>

                        <p className="mt-2 text-xl font-bold">
                            #{user.id}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Account Status
                        </p>

                        <span
                            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${user.status
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {user.status ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Email Verification
                        </p>

                        <span
                            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${user.email_verified_at
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {user.email_verified_at
                                ? 'Verified'
                                : 'Not Verified'}
                        </span>
                    </div>

                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Last Login
                        </p>

                        <p className="mt-2 font-semibold">
                            {user.last_login_at ?? 'Never'}
                        </p>
                    </div>

                </div>

                {/* USER INFORMATION */}
                <div className="rounded-3xl border bg-card shadow-sm">

                    <div className="border-b px-6 py-4">
                        <h2 className="text-lg font-semibold">
                            User Information
                        </h2>
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-2">

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Full Name
                            </p>

                            <p className="mt-1 font-medium">
                                {user.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Email Address
                            </p>

                            <p className="mt-1 font-medium">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Phone Number
                            </p>

                            <p className="mt-1 font-medium">
                                {user.phone ?? '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Last Login
                            </p>

                            <p className="mt-1 font-medium">
                                {user.last_login_at ?? 'Never'}
                            </p>
                        </div>

                    </div>

                </div>

                {/* AUDIT INFORMATION */}
                <div className="rounded-3xl border bg-card shadow-sm">

                    <div className="border-b px-6 py-4">
                        <h2 className="text-lg font-semibold">
                            Audit Information
                        </h2>
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-2">

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Created At
                            </p>

                            <p className="mt-1 font-medium">
                                {user.created_at}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Updated At
                            </p>

                            <p className="mt-1 font-medium">
                                {user.updated_at}
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
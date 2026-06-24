import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Shield, Hash } from 'lucide-react';

export default function Show({ permission }: any) {
    return (
        <AppLayout>
            <Head title="Permission Details" />

            <div className="mx-auto max-w-5xl p-6 space-y-6">

                {/* HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Permission Details
                            </h1>

                            <p className="text-muted-foreground">
                                View permission information and system details.
                            </p>
                        </div>

                    </div>

                    <Link
                        href={route('permissions.edit', permission.id)}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        Edit Permission
                    </Link>

                </div>

                {/* SUMMARY CARD */}
                <div className="rounded-3xl border bg-card shadow-sm">

                    <div className="border-b p-6">

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-primary/10 p-3">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">
                                    Permission Information
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Basic details about this permission.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="p-6">

                        <div className="grid gap-6 md:grid-cols-2">

                            {/* ID */}
                            <div className="rounded-2xl border p-5">

                                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                                    <Hash className="h-4 w-4" />
                                    <span className="text-sm">
                                        Permission ID
                                    </span>
                                </div>

                                <p className="text-2xl font-bold">
                                    {permission.id}
                                </p>

                            </div>

                            {/* NAME */}
                            <div className="rounded-2xl border p-5">

                                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                                    <Shield className="h-4 w-4" />
                                    <span className="text-sm">
                                        Permission Name
                                    </span>
                                </div>

                                <p className="text-lg font-semibold break-all">
                                    {permission.name}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 border-t p-6">

                        <Link
                            href={route('permissions.index')}
                            className="rounded-xl border px-5 py-2.5 font-medium transition hover:bg-muted"
                        >
                            Back to Permissions
                        </Link>

                        <Link
                            href={route('permissions.edit', permission.id)}
                            className="rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            Edit Permission
                        </Link>

                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
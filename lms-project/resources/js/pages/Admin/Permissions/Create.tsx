import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } =
        useForm({
            name: '',
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('permissions.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Permission" />

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
                                Create Permission
                            </h1>

                            <p className="text-muted-foreground">
                                Add a new system permission for role management.
                            </p>
                        </div>

                    </div>

                </div>

                {/* FORM CARD */}
                <form
                    onSubmit={submit}
                    className="rounded-3xl border bg-card shadow-sm"
                >

                    {/* CARD HEADER */}
                    <div className="border-b p-6">

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-primary/10 p-3">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>

                            <div>
                                <h2 className="font-semibold text-lg">
                                    Permission Information
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Define the permission name used throughout the system.
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* FORM BODY */}
                    <div className="p-6">

                        <div className="max-w-2xl">

                            <label className="mb-2 block text-sm font-medium">
                                Permission Name
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g. users.create"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    px-4
                                    py-3
                                    transition
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-primary/20
                                "
                            />

                            {errors.name && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}

                            <p className="mt-2 text-xs text-muted-foreground">
                                Examples: users.create, users.edit, roles.view
                            </p>

                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 border-t p-6">

                        <Link
                            href={route('permissions.index')}
                            className="
                                rounded-xl
                                border
                                px-5
                                py-2.5
                                font-medium
                                transition
                                hover:bg-muted
                            "
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="
                                rounded-xl
                                bg-primary
                                px-5
                                py-2.5
                                font-medium
                                text-primary-foreground
                                transition
                                hover:opacity-90
                            "
                        >
                            {processing
                                ? 'Saving...'
                                : 'Create Permission'}
                        </button>

                    </div>

                </form>

            </div>
        </AppLayout>
    );
}
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft } from 'lucide-react';

type Permission = {
    id: number;
    name: string;
};

export default function Index({
    permissions,
}: {
    permissions: Permission[];
}) {
    // const destroy = (id: number) => {
    //     if (confirm('Delete permission?')) {
    //         router.delete(route('permissions.destroy', id));
    //     }
    // };

    return (
        <AppLayout>
            <Head title="Permissions" />

            <div className="p-6 space-y-6">

                {/* HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => window.history.back()}
                            className="
                                inline-flex items-center gap-2
                                rounded-xl border bg-card
                                px-4 py-2 text-sm font-medium
                                shadow-sm transition-all
                                hover:bg-muted hover:shadow
                            "
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Permissions
                            </h1>

                            <p className="text-muted-foreground">
                                Manage system permissions and access controls.
                            </p>
                        </div>

                    </div>

                    <Link
                        href={route('permissions.create')}
                        className="
                            rounded-xl
                            bg-primary
                            px-5 py-2.5
                            text-sm font-medium
                            text-primary-foreground
                            transition hover:opacity-90
                        "
                    >
                        + Create Permission
                    </Link>

                </div>

                {/* STATS */}
                <div className="grid gap-4 md:grid-cols-3">

                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Total Permissions
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {permissions.length}
                        </p>
                    </div>

                </div>

                {/* TABLE CARD */}
                <div className="rounded-3xl border bg-card shadow-sm">

                    <div className="border-b px-6 py-4">
                        <h2 className="font-semibold">
                            All Permissions
                        </h2>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-4 text-left">
                                        ID
                                    </th>

                                    <th className="px-4 py-4 text-left">
                                        Permission Name
                                    </th>

                                    <th className="px-4 py-4 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {permissions.length > 0 ? (
                                    permissions.map((permission) => (
                                        <tr
                                            key={permission.id}
                                            className="
                                                border-t
                                                transition
                                                hover:bg-muted/30
                                            "
                                        >
                                            <td className="px-4 py-4 font-medium">
                                                #{permission.id}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-blue-100
                                                        px-3 py-1
                                                        text-xs
                                                        font-medium
                                                        text-blue-700
                                                    "
                                                >
                                                    {permission.name}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">

                                                <div className="flex justify-center gap-2">

                                                    <Link
                                                        href={route(
                                                            'permissions.show',
                                                            permission.id
                                                        )}
                                                        className="
                                                            rounded-lg
                                                            bg-blue-500
                                                            px-3 py-1.5
                                                            text-xs
                                                            font-medium
                                                            text-white
                                                            transition
                                                            hover:bg-blue-600
                                                        "
                                                    >
                                                        View
                                                    </Link>

                                                    <Link
                                                        href={route(
                                                            'permissions.edit',
                                                            permission.id
                                                        )}
                                                        className="
                                                            rounded-lg
                                                            bg-yellow-500
                                                            px-3 py-1.5
                                                            text-xs
                                                            font-medium
                                                            text-white
                                                            transition
                                                            hover:bg-yellow-600
                                                        "
                                                    >
                                                        Edit
                                                    </Link>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                className="
                rounded-lg
                bg-red-600
                px-3 py-1.5
                text-xs
                font-medium
                text-white
                transition
                hover:bg-red-700
            "
                                                            >
                                                                Delete
                                                            </button>
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Delete Permission?
                                                                </AlertDialogTitle>

                                                                <AlertDialogDescription>
                                                                    This action cannot be undone.
                                                                    This will permanently delete the permission
                                                                    <strong> "{permission.name}"</strong>.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>

                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>

                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        router.delete(
                                                                            route('permissions.destroy', permission.id)
                                                                        )
                                                                    }
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                </div>

                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="py-10 text-center text-muted-foreground"
                                        >
                                            No permissions found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
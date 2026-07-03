import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Class Assignment',
        href: '/class-assignment',
    },
];

export default function ClassAssignment() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Class Assignment" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

    {/* Header */}

    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

        <div>

            <h2 className="text-xl font-semibold text-gray-900">
                Class Assignments
            </h2>

            <p className="text-sm text-gray-500">
                Manage assignments for your classes.
            </p>

        </div>

        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Create Assignment
        </button>

    </div>

    <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">

                <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Assignment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Class & Subject
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Teacher
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Schedule
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                        Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                        Actions
                    </th>

                </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

                <tr className="hover:bg-gray-50">

                    {/* Assignment */}

                    <td className="px-6 py-4">

                        <h3 className="font-semibold text-gray-900">
                            HTML Forms
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            Create a responsive registration form using HTML.
                        </p>

                    </td>

                    {/* Class */}

                    <td className="px-6 py-4">

                        <p className="font-medium">
                            Grade 10-A
                        </p>

                        <p className="text-sm text-gray-500">
                            Web Design
                        </p>

                    </td>

                    {/* Teacher */}

                    <td className="px-6 py-4">
                        Mr. Ali
                    </td>

                    {/* Dates */}

                    <td className="px-6 py-4">

                        <p className="text-sm">
                            <span className="font-medium">
                                Assigned:
                            </span>

                            01 Jul 2026
                        </p>

                        <p className="mt-1 text-sm">
                            <span className="font-medium">
                                Due:
                            </span>

                            08 Jul 2026
                        </p>

                    </td>

                    {/* Status */}

                    <td className="px-6 py-4 text-center">

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                            Active

                        </span>

                    </td>

                    {/* Action */}

                    <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                            <button className="rounded-md bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                                View
                            </button>

                            <button className="rounded-md bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200">
                                Edit
                            </button>

                            <button className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200">
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</div>
            </div>
        </AppLayout>
    );
}

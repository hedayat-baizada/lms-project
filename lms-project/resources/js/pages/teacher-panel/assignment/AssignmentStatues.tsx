import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assignment Statuses',
        href: '/assignment-statuses',
    },
];

export default function AssignmentStatues() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assignment Statuses" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            
    
        <div className="space-y-6">

            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Assignment Status
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Monitor assignment completion for this class.
                        </p>

                    </div>

                    <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        Back to Assignments
                    </button>

                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Class
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                            Grade 10-A
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Subject
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                            Web Design
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Assignment
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                            HTML Forms
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Teacher
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                            Mr. Ali
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Due Date
                        </p>

                        <p className="mt-1 font-semibold text-red-600">
                            08 Jul 2026
                        </p>
                    </div>

                </div>

            </div>

            {/* Table Card */}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {/* Search */}

                

                <div className="overflow-x-auto">

                    <table className="min-w-full divide-y divide-gray-200">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Student
                                </th>

                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Checked By
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Checked At
                                </th>

                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white">

                           

                                

                            <tr className="hover:bg-gray-50">

                                <td className="px-6 py-4">

                                    <div>

                                        <p className="font-semibold">
                                            Sara Khan
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Student ID: ST-1002
                                        </p>

                                    </div>

                                </td>

                                <td className="px-6 py-4 text-center">

                                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                        Late
                                    </span>

                                </td>

                                <td className="px-6 py-4">
                                    Mr. Ali
                                </td>

                                <td className="px-6 py-4">
                                    09 Jul 2026
                                </td>

                                <td className="px-6 py-4 text-center">

                                    <button className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                                        View
                                    </button>

                                </td>

                            </tr>

                            

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
  
            </div>
        </AppLayout>
    );
}

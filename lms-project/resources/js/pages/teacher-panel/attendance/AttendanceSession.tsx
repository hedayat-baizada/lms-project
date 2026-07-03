import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendance Session',
        href: '/attendance-session',
    },
];

export default function AttendanceSession() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Session" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

        <div>

            <h2 className="text-xl font-semibold text-gray-900">
                Attendance Sessions
            </h2>

            <p className="text-sm text-gray-500">
                View and manage attendance sessions.
            </p>

        </div>

        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Start Attendance
        </button>

    </div>

    <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">

                <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Day
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Class
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Teacher
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                        Started At
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                        Ended At
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                        Holiday
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

                    <td className="px-6 py-4">02 Jul 2026</td>

                    <td className="px-6 py-4">Thursday</td>

                    <td className="px-6 py-4 font-medium">Grade 10-A</td>

                    <td className="px-6 py-4">Mr. Ali</td>

                    <td className="px-6 py-4 text-center">08:00 AM</td>

                    <td className="px-6 py-4 text-center">08:08 AM</td>

                    <td className="px-6 py-4 text-center">

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            No
                        </span>

                    </td>

                    <td className="px-6 py-4 text-center">

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            Closed
                        </span>

                    </td>

                    <td className="px-6 py-4 text-right">

                        <button className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                            View
                        </button>

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

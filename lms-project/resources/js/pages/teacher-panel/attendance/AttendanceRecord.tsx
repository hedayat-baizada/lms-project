import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendance Record',
        href: '/attendance-record',
    },
];

export default function AttendanceRecord() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Record" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

    {/* Header */}

    <div className="flex items-center justify-between border-b border-gray-200 p-6">

        <div>

            <h2 className="text-xl font-semibold text-gray-900">
                Attendance Records
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                Grade 10-A • 02 July 2026
            </p>

        </div>

        <button
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
            Save Attendance
        </button>

    </div>

    <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">

                <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Student
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                        Status
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                        Absence Count
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Marked By
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Remarks
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                        Actions
                    </th>

                </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

                <tr className="hover:bg-gray-50">

    <td className="px-6 py-4 font-medium text-gray-900">
        Ahmad Khan
    </td>

    <td className="px-6 py-4 text-center">

        <select className="rounded-lg border border-gray-300 px-3 py-2">

            <option>Present</option>

            <option>Absent</option>

            <option>Late</option>

            <option>Excused</option>

        </select>

    </td>

    <td className="px-6 py-4 text-center">
        0
    </td>

    <td className="px-6 py-4">
        Mr. Ali
    </td>

    <td className="px-6 py-4">
        -
    </td>

    <td className="px-6 py-4 text-right">

        <button className="rounded-md border px-3 py-1 hover:bg-gray-100">
            Edit
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

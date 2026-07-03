import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notification',
        href: '/notification',
    },
];

export default function Notification() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notification" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
               <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

    {/* Header */}
    <div className="flex items-center justify-between border-b border-gray-200 p-6">

        <div>
            <h1 className="text-2xl font-bold text-gray-900">
                Notifications
            </h1>

            <p className="mt-1 text-sm text-gray-500">
                Stay updated with assignments, attendance, announcements and live sessions.
            </p>
        </div>

        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Create Notification
        </button>

    </div>

    {/* Search & Filter */}
    <div className="flex items-center justify-between border-b border-gray-200 p-4">

        <input
            type="text"
            placeholder="Search notifications..."
            className="w-80 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />

        {/* <div className="flex gap-3">

            <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
                <option>All Types</option>
                <option>Assignment</option>
                <option>Attendance</option>
                <option>Announcement</option>
                <option>Live Session</option>
            </select>

            <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
                <option>All Status</option>
                <option>Read</option>
                <option>Unread</option>
            </select>

        </div> */}

    </div>

    {/* Table */}
    <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">

                <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                        Notification
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                        Type
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                        Status
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                        Received
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                        Actions
                    </th>

                </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

                {/* Notification Row */}

            </tbody>

        </table>

    </div>

</div>
            </div>
        </AppLayout>
    );
}

import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Session',
        href: '/session',
    },
];

export default function Session() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Session" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
             
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Live Class Sessions
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        View and join your scheduled online classes.
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Search session..."
                    className="w-72 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />

            </div>

            {/* Table */}
            <div className="overflow-x-auto">

                <table className="min-w-full divide-y divide-gray-200">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Session
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Class & Subject
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Schedule
                            </th>

                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Platform
                            </th>

                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Status
                            </th>

                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-100">

                        <tr className="hover:bg-gray-50">

                            {/* Session */}
                            <td className="px-6 py-4">

                              

                            </td>

                            {/* Class */}
                            <td className="px-6 py-4">

                                

                            </td>

                            {/* Schedule */}
                            <td className="px-6 py-4">

                               

                            </td>

                            {/* Platform */}
                            <td className="px-6 py-4 text-center">

                               

                            </td>

                            {/* Status */}
                            <td className="px-6 py-4 text-center">


                            </td>

                            {/* Action */}
                            <td className="px-6 py-4 text-center">

                                <a
                                    href="#"
                                    className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Join Session
                                </a>

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

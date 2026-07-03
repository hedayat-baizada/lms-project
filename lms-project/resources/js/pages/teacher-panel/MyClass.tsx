import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Class',
        href: '/my-class',
    },
];

export default function MyClass() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Class" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-6">

            {/* Teacher Card */}

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            My Classes
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Manage all classes assigned to you.
                        </p>

                    </div>

                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">

                    <div>

                        <p className="text-xs uppercase text-gray-500">
                            Teacher
                        </p>

                        

                    </div>

                    <div>

                        <p className="text-xs uppercase text-gray-500">
                            Email
                        </p>

                        

                    </div>

                    <div>

                        <p className="text-xs uppercase text-gray-500">
                            Assigned Classes
                        </p>


                    </div>

                </div>

            </div>

            {/* Table */}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-200 p-4">

                    <input
                        type="text"
                        placeholder="Search class..."
                        className="w-80 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    />

                    

                </div>

                <div className="overflow-x-auto">

                    <table className="min-w-full divide-y divide-gray-200">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                    Class
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                    Subject
                                </th>

                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                                    Assigned Date
                                </th>

                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                                    Students
                                </th>

                                

                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            <tr className="hover:bg-gray-50">

                                

                               

                               

                                

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

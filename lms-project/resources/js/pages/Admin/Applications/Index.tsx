import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Application = {
    id: number;
    tracking_code: string | null;
    full_name: string | null;
    email: string;
    phone: string | null;
    course_category: string | null;
    course_track: string | null;
    selected_computer_topic: string | null;
    status: string;
    created_at: string;
};

type Props = {
    applications: Application[];
    filters: {
        search: string | null;
        status: string | null;
        course: string | null;
    };
    stats: {
        total: number;
        waiting_review: number;
        approved: number;
        rejected: number;
        need_correction: number;
    };
};

export default function ApplicationsIndex({ applications, filters, stats }: Props) {    

    const [searchText, setSearchText] = useState(filters.search ?? '');

    function updateFilter(key: string, value: string) {
    router.get(
        '/applications',
        {
            ...filters,
            [key]: value || undefined,
        },
        {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        }
    );
}

function resetFilters() {
    setSearchText('');

    router.get('/applications', {}, {
        preserveState: false,
        preserveScroll: true,
        replace: true,
    });
}



    return (
        <AppLayout>

            
            <div className="p-6">
                <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white shadow-xl">

                <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
                    Admissions Management
                </p>

                <h1 className="mt-3 text-4xl font-bold">
                    Applications Dashboard
                </h1>

                <p className="mt-3 max-w-3xl text-blue-100">
                    Review applications, manage placement results, request corrections,
                    and make admission decisions from one place.
                </p>

            </div>


            <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    <DashboardCard
        title="Total Applications"
       value={stats.total}
        color="blue"
    />

    <DashboardCard
        title="Waiting Review"
       value={stats.waiting_review}
        color="amber"
    />

    <DashboardCard
        title="Approved"
        value={stats.approved}
        color="green"
    />

    <DashboardCard
        title="Rejected"
        value={stats.rejected}
        color="red"
    />

    <DashboardCard
    title="Needs Correction"
    value={stats.need_correction}
    color="orange"
/>

</div>



            
                <div className="overflow-x-auto rounded border bg-white">
                    <table className="w-full text-left text-sm">
                        
                        {/* <thead className="bg-gray-100">
                            <tr>
                                
                                <th className="p-3">Tracking Code</th>
                                <th className="p-3">Applicant</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Course</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead> */}


<div className="mb-8 rounded-2xl bg-white p-6 shadow">
    <div className="grid gap-4 md:grid-cols-4">
        <div className="flex gap-2 md:col-span-2">
    <input
        id="searchInput"
        type="text"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search name, email, tracking code..."
        className="flex-1 rounded-xl border px-4 py-3"
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                updateFilter('search', e.currentTarget.value);
            }
        }}
    />

    <button
        type="button"
        onClick={() => {
            updateFilter('search', searchText);
        }}
        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
    >
        Search
    </button>
</div>

        <select
            defaultValue={filters.status ?? ''}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="rounded-xl border px-4 py-3"
        >
            <option value="">All Statuses</option>
            <option value="incomplete">Incomplete</option>
            <option value="waiting_review">Waiting Review</option>
            <option value="need_correction">Needs Correction</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
        </select>

        <select
            defaultValue={filters.course ?? ''}
            onChange={(e) => updateFilter('course', e.target.value)}
            className="rounded-xl border px-4 py-3"
        >
            <option value="">All Courses</option>
            <option value="prep_cel">Prep-CEL</option>
            <option value="cel">CEL</option>
        </select>
    </div>

    <button
        type="button"
        onClick={resetFilters}
        className="mt-4 rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200"
    >
        Reset Filters
    </button>
</div>



                        <tbody>
    {applications.length === 0 && (
        <tr>
            <td colSpan={7} className="p-0">
                <div className="p-10 text-center text-gray-500">
                    No applications found.
                </div>
            </td>
        </tr>
    )}

    {applications.map((application) => (
        <tr key={application.id}>
            <td colSpan={7} className="border-0 bg-slate-100 p-3">

                <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        {/* Left */}

                        <div className="space-y-3">

                            <div className="flex items-center gap-3">

                                <h2 className="text-xl font-bold">
                                    {application.full_name ?? '-'}
                                </h2>

                                <StatusBadge
                                    status={application.status}
                                />

                            </div>

                            <p className="font-medium text-blue-600">
                                {application.tracking_code}
                            </p>

                            <p className="text-gray-600">
                                {application.email}
                            </p>

                            <p className="text-gray-600">
                                {application.phone ?? '-'}
                            </p>

                            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm">

                                {application.course_category ?? '-'} /
                                {' '}
                                {application.course_track ??
                                    application.selected_computer_topic ??
                                    '-'}

                            </div>

                        </div>

                        {/* Right */}

                        <div className="text-right">

                            <p className="text-sm text-gray-500">
                                Submitted
                            </p>

                            <p className="font-semibold">
                                {new Date(
                                    application.created_at
                                ).toLocaleDateString()}
                            </p>

                            <Link
                                href={`/applications/${application.id}`}
                                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                            >
                                Review Application →
                            </Link>

                        </div>

                    </div>

                </div>

            </td>
        </tr>
    ))}
</tbody>
                    </table>
                </div>

                
            </div>


            
        </AppLayout>
    );
}


function DashboardCard({
    title,
    value,
    color,
}: {
    title: string;
    value: number;
    color: 'blue' | 'amber' | 'green' | 'red' | 'orange';
}) {
    const colors = {
        blue: 'border-blue-500',
        amber: 'border-amber-500',
        green: 'border-green-500',
        red: 'border-red-500',
        orange: 'border-orange-500',
    };

    return (
        <div
            className={`rounded-2xl border-l-4 ${colors[color]} bg-white p-6 shadow`}
        >
            <p className="text-sm font-medium text-gray-500">
                {title}
            </p>

            <p className="mt-3 text-4xl font-bold">
                {value}
            </p>
        </div>
    );
}



function StatusBadge({
    status,
}: {
    status: string;
}) {

    const styles = {
        waiting_review:
            'bg-yellow-100 text-yellow-800',

        approved:
            'bg-green-100 text-green-800',

        rejected:
            'bg-red-100 text-red-800',

        correction_requested:
            'bg-orange-100 text-orange-800',
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                styles[status as keyof typeof styles] ??
                'bg-gray-100 text-gray-700'
            }`}
        >
            {status.replaceAll('_', ' ')}
        </span>
    );
}
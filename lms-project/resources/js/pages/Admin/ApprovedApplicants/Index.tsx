import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
type Props = {
    applications: any[];
};

export default function ApprovedApplicantsIndex({ applications }: Props) {

    const [search, setSearch] = useState('');


    const filteredApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
        return applications;
    }

    return applications.filter((application: any) =>
        [
            application.full_name,
            application.email,
            application.tracking_code,
            application.course_track,
        ]
            .join(' ')
            .toLowerCase()
            .includes(query)
    );
}, [applications, search]);

function resetSearch() {
    setSearch('');
}
    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-8 rounded-3xl bg-gradient-to-r from-green-800 to-emerald-700 p-8 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-green-100">
                        Academic Handoff
                    </p>

                    <h1 className="mt-3 text-4xl font-bold">
                        Approved Applicants
                    </h1>

                    <p className="mt-3 max-w-3xl text-green-100">
                        These applicants have been approved by Admissions and are ready for student creation by the Academic Department.
                    </p>
                </div>


                <div className="mb-6 flex flex-col gap-4 md:flex-row">

    <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, tracking code, Prep-CEL, or CEL..."
        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 focus:border-green-500 focus:outline-none"
    />

    <button
        type="button"
        onClick={resetSearch}
        disabled={!search}
        className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-100 disabled:opacity-50"
    >
        Reset Search
    </button>

</div>

<p className="mb-6 text-sm text-slate-500">
    Showing {filteredApplicants.length} of {applications.length} approved applicant(s).
</p>

                <div className="space-y-4">
                    {applications.length === 0 && (
                        <div className="rounded-2xl bg-white p-10 text-center shadow">
                            <p className="text-gray-500">
                                No approved applicants found.
                            </p>
                        </div>
                    )}

                    {filteredApplicants.map((application) => (
                        <div
                            key={application.id}
                            className="rounded-2xl bg-white p-6 shadow"
                        >
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {application.full_name}
                                    </h2>

                                    <p className="mt-1 text-blue-600">
                                        {application.email}
                                    </p>

                                    <p className="mt-1 text-gray-600">
                                        {application.phone ?? '-'}
                                    </p>

                                    <div className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                                        Approved
                                    </div>
                                </div>

                                <div className="text-left lg:text-right">
                                    <p className="text-sm text-gray-500">
                                        Assigned Level
                                    </p>

                                    <p className="font-bold text-slate-900">
                                        {application.placement_test?.placement_level ?? '-'}
                                    </p>

                                    <p className="mt-3 text-sm text-gray-500">
                                        Approved Date
                                    </p>

                                    <p className="font-semibold">
                                        {application.reviewed_at
                                            ? new Date(application.reviewed_at).toLocaleDateString()
                                            : '-'}
                                    </p>

                                    <Link
                                        href={`/approved-applicants/${application.id}`}
                                        className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                                    >
                                        View Handoff →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
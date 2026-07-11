import AppLayout from '@/layouts/app-layout';
import { useMemo, useState } from 'react';

type TeamApplication = {
    id: number;
    full_name: string;
    email: string;
    tracking_code: string;
    application_type: string;
    teacher_subject: string | null;
    professional_role: string | null;
    updated_at: string | null;
};

type Props = {
    applications: TeamApplication[];
};

export default function RejectedTeamApplications({
    applications,
}: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return applications;
        }

        return applications.filter((application) =>
            [
                application.full_name,
                application.email,
                application.tracking_code,
                formatRole(application),
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
            <div className="space-y-8 p-6">

                <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-red-900 to-rose-900 p-8 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-red-100">
                        Academy Team
                    </p>

                    <h1 className="mt-3 text-4xl font-bold">
                        Rejected Team Applications
                    </h1>

                    <p className="mt-3 text-red-100">
                        View rejected volunteer and professional team applications.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow">

                    <div className="flex flex-col gap-4 md:flex-row">

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search by name, email, tracking code or role..."
                            className="flex-1 rounded-xl border px-4 py-3"
                        />

                        <button
                            onClick={resetSearch}
                            disabled={!search}
                            className="rounded-xl border px-5 py-3 font-semibold disabled:opacity-40"
                        >
                            Reset Search
                        </button>

                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                        Showing {filtered.length} of {applications.length} rejected application(s).
                    </p>

                </div>

                <div className="rounded-3xl bg-white p-6 shadow">

                    {filtered.length === 0 ? (

                        <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
                            No rejected team applications found.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px] text-left">

                                <thead>

                                    <tr className="border-b text-sm text-slate-500">

                                        <th className="py-3">Name</th>

                                        <th className="py-3">Role</th>

                                        <th className="py-3">Email</th>

                                        <th className="py-3">Tracking Code</th>

                                        <th className="py-3">Rejected On</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filtered.map((application) => (

                                        <tr
                                            key={application.id}
                                            className="border-b last:border-none"
                                        >

                                            <td className="py-4 font-semibold">
                                                {application.full_name}
                                            </td>

                                            <td className="py-4">
                                                <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                                                    {formatRole(application)}
                                                </span>
                                            </td>

                                            <td className="py-4">
                                                {application.email}
                                            </td>

                                            <td className="py-4 font-mono text-sm">
                                                {application.tracking_code}
                                            </td>

                                            <td className="py-4">
                                                {new Date(
                                                    application.updated_at ?? ''
                                                ).toLocaleDateString()}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>
        </AppLayout>
    );
}

function formatRole(application: TeamApplication) {

    if (application.application_type === 'volunteer_teacher') {
        return `Volunteer ${
            application.teacher_subject === 'english'
                ? 'English'
                : 'Computer'
        } Teacher`;
    }

    if (
        application.application_type === 'professional_staff' &&
        application.professional_role === 'teacher'
    ) {
        return `Professional ${
            application.teacher_subject === 'english'
                ? 'English'
                : 'Computer'
        } Teacher`;
    }

    if (
        application.application_type === 'professional_staff' &&
        application.professional_role === 'staff'
    ) {
        return 'Professional Staff';
    }

    if (application.application_type === 'volunteer_manager') {
        return 'Volunteer Manager / Coordinator';
    }

    if (application.application_type === 'volunteer_support') {
        return 'Volunteer Support Staff';
    }

    return application.application_type;
}
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

type Props = {
    applications: any[];
};

export default function ApprovedApplicantsIndex({ applications }: Props) {
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

                <div className="space-y-4">
                    {applications.length === 0 && (
                        <div className="rounded-2xl bg-white p-10 text-center shadow">
                            <p className="text-gray-500">
                                No approved applicants found.
                            </p>
                        </div>
                    )}

                    {applications.map((application) => (
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
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';

type Props = {
    applications: any[];
};

const types = [
    {
        key: 'all',
        label: 'All Applications',
        color: 'bg-slate-900',
    },
    {
        key: 'volunteer_teacher',
        label: 'Volunteer Teachers',
        color: 'bg-emerald-600',
    },
    {
        key: 'volunteer_manager',
        label: 'Managers / Coordinators',
        color: 'bg-blue-600',
    },
    {
        key: 'volunteer_support',
        label: 'Support Staff',
        color: 'bg-purple-600',
    },
    {
        key: 'professional_staff',
        label: 'Professional Staff',
        color: 'bg-orange-600',
    },
    {
    key: 'professional_teacher',
    label: 'Professional Teachers',
    color: 'bg-cyan-700',
    },
];

export default function TeamApplicationsIndex({ applications }: Props) {
    const params = new URLSearchParams(window.location.search);
    const selectedType = params.get('type') ?? 'all';

    const filteredApplications = applications.filter((application) => {
    if (selectedType === 'all') {
        return true;
    }

    if (selectedType === 'professional_teacher') {
        return (
            application.application_type === 'professional_staff' &&
            application.professional_role === 'teacher'
        );
    }

    if (selectedType === 'professional_staff') {
        return (
            application.application_type === 'professional_staff' &&
            application.professional_role === 'staff'
        );
    }

    return application.application_type === selectedType;
});

    function countByType(type: string) {
    if (type === 'all') {
        return applications.length;
    }

    if (type === 'professional_teacher') {
        return applications.filter(
            (application) =>
                application.application_type ===
                    'professional_staff' &&
                application.professional_role === 'teacher'
        ).length;
    }

    if (type === 'professional_staff') {
        return applications.filter(
            (application) =>
                application.application_type ===
                    'professional_staff' &&
                application.professional_role === 'staff'
        ).length;
    }

    return applications.filter(
        (application) =>
            application.application_type === type
    ).length;
}

    function filter(type: string) {
        if (type === 'all') {
            router.get('/team-applications');
            return;
        }

        router.get('/team-applications', { type });
    }

    function formatType(application: any) {
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

    return application.application_type
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (character: string) =>
            character.toUpperCase()
        );
}

    function statusBadge(status: string) {
        switch (status) {
            case 'waiting_review':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'need_correction':
                return 'bg-orange-100 text-orange-800';
            case 'correction_submitted':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 p-8 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">
                        Reviewer Panel
                    </p>

                    <h1 className="mt-3 text-4xl font-bold">
                        Team Applications
                    </h1>

                    <p className="mt-3 max-w-3xl text-emerald-100">
                        Review academy team applications, filter by role, and manage approval decisions.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                    {types.map((type) => (
                        <button
                            key={type.key}
                            type="button"
                            onClick={() => filter(type.key)}
                            className={`rounded-3xl p-6 text-left text-white shadow transition hover:scale-[1.02] ${
                                type.color
                            } ${
                                selectedType === type.key
                                    ? 'ring-4 ring-offset-2 ring-slate-400'
                                    : ''
                            }`}
                        >
                            <p className="text-sm opacity-80">{type.label}</p>

                            <p className="mt-3 text-4xl font-bold">
                                {countByType(type.key)}
                            </p>
                        </button>
                    ))}
                </div>

                <div className="rounded-3xl bg-white p-6 shadow">
                    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                Applications List
                            </h2>

                            <p className="text-slate-500">
                                Showing {filteredApplications.length} application(s).
                            </p>
                        </div>
                    </div>

                    {filteredApplications.length === 0 ? (
                        <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
                            No team applications found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left">
                                <thead>
                                    <tr className="border-b text-sm text-slate-500">
                                        <th className="py-3">Applicant</th>
                                        <th className="py-3">Role</th>
                                        <th className="py-3">Contact</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Submitted</th>
                                        <th className="py-3 text-right">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredApplications.map((application) => (
                                        <tr
                                            key={application.id}
                                            className="border-b last:border-none"
                                        >
                                            <td className="py-4">
                                                <div className="font-bold text-slate-900">
                                                    {application.full_name}
                                                </div>

                                                <div className="text-sm text-slate-500">
                                                    {application.tracking_code}
                                                </div>
                                            </td>

                                            <td className="py-4">
                                                {formatType(application)}
                                            </td>

                                            <td className="py-4">
                                                <div>{application.email}</div>
                                                <div className="text-sm text-slate-500">
                                                    {application.phone}
                                                </div>
                                            </td>

                                            <td className="py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-sm font-semibold ${statusBadge(
                                                        application.status
                                                    )}`}
                                                >
                                                    {application.status.replaceAll('_', ' ')}
                                                </span>
                                            </td>

                                            <td className="py-4">
                                                {application.submitted_at
                                                    ? new Date(application.submitted_at).toLocaleDateString()
                                                    : '-'}
                                            </td>

                                            <td className="py-4 text-right">
                                                <Link
                                                    href={`/team-applications/${application.id}`}
                                                    className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-900"
                                                >
                                                    Review
                                                </Link>
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
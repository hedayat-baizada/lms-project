import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';

type Props = {
    staffs: any[];
};

const categories = [
    {
        key: 'all',
        label: 'All Approved Staffs',
        color: 'bg-slate-900',
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
];

export default function ApprovedStaffs({ staffs }: Props) {
    const params = new URLSearchParams(window.location.search);
    const selectedType = params.get('type') ?? 'all';

    const filteredStaffs = staffs.filter((staff) => {
        if (selectedType === 'all') {
            return true;
        }

        if (selectedType === 'professional_staff') {
            return (
                staff.application_type === 'professional_staff' &&
                staff.professional_role === 'staff'
            );
        }

        return staff.application_type === selectedType;
    });

    function countByType(type: string) {
        if (type === 'all') {
            return staffs.length;
        }

        if (type === 'professional_staff') {
            return staffs.filter(
                (staff) =>
                    staff.application_type === 'professional_staff' &&
                    staff.professional_role === 'staff'
            ).length;
        }

        return staffs.filter(
            (staff) => staff.application_type === type
        ).length;
    }

    function filter(type: string) {
        if (type === 'all') {
            router.get('/approved-staffs');
            return;
        }

        router.get('/approved-staffs', { type });
    }

    function formatRole(staff: any) {
        if (staff.application_type === 'volunteer_manager') {
            return 'Volunteer Manager / Coordinator';
        }

        if (staff.application_type === 'volunteer_support') {
            return 'Volunteer Support Staff';
        }

        if (
            staff.application_type === 'professional_staff' &&
            staff.professional_role === 'staff'
        ) {
            return 'Professional Staff';
        }

        return 'Staff';
    }

    function roleBadge(staff: any) {
        if (staff.application_type === 'volunteer_manager') {
            return 'bg-blue-100 text-blue-800';
        }

        if (staff.application_type === 'volunteer_support') {
            return 'bg-purple-100 text-purple-800';
        }

        return 'bg-orange-100 text-orange-800';
    }

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white shadow-xl">
                    <h1 className="text-4xl font-bold">
                        Approved Staffs
                    </h1>

                    <p className="mt-3 text-blue-100">
                        Approved managers, support staff, and professional staff
                        ready for the next administrative step.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {categories.map((category) => (
                        <button
                            key={category.key}
                            type="button"
                            onClick={() => filter(category.key)}
                            className={`rounded-3xl p-6 text-left text-white shadow transition hover:scale-[1.02] ${
                                category.color
                            } ${
                                selectedType === category.key
                                    ? 'ring-4 ring-offset-2 ring-slate-400'
                                    : ''
                            }`}
                        >
                            <p className="text-sm opacity-80">
                                {category.label}
                            </p>

                            <p className="mt-3 text-4xl font-bold">
                                {countByType(category.key)}
                            </p>
                        </button>
                    ))}
                </div>

                <div className="rounded-3xl bg-white p-6 shadow">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Approved Staff List
                        </h2>

                        <p className="text-slate-500">
                            Showing {filteredStaffs.length} approved applicant(s).
                        </p>
                    </div>

                    {filteredStaffs.length === 0 ? (
                        <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
                            No approved staff found in this category.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left">
                                <thead>
                                    <tr className="border-b text-sm text-slate-500">
                                        <th className="py-3">Applicant</th>
                                        <th className="py-3">Role</th>
                                        <th className="py-3">Email</th>
                                        <th className="py-3">WhatsApp</th>
                                        <th className="py-3">Approved Date</th>
                                        <th className="py-3 text-right">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredStaffs.map((staff) => (
                                        <tr
                                            key={staff.id}
                                            className="border-b last:border-none"
                                        >
                                            <td className="py-4">
                                                <div className="font-semibold text-slate-900">
                                                    {staff.full_name}
                                                </div>

                                                <div className="text-sm text-slate-500">
                                                    {staff.tracking_code}
                                                </div>
                                            </td>

                                            <td className="py-4">
                                                <span
                                                    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold ${roleBadge(
                                                        staff
                                                    )}`}
                                                >
                                                    {formatRole(staff)}
                                                </span>
                                            </td>

                                            <td className="py-4">
                                                {staff.email}
                                            </td>

                                            <td className="py-4">
                                                {staff.phone}
                                            </td>

                                            <td className="py-4">
                                                {staff.approved_at
                                                    ? new Date(
                                                          staff.approved_at
                                                      ).toLocaleDateString()
                                                    : '-'}
                                            </td>

                                            <td className="py-4 text-right">
                                                <Link
                                                    href={`/approved-staffs/${staff.id}`}
                                                    className="whitespace-nowrap rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-900"
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
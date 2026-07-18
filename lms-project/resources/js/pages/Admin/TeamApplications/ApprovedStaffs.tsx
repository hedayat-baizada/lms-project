import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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
const [search, setSearch] = useState('');
const [category, setCategory] = useState('all');

function formatRole(staff: any) {
    if (staff.application_type === 'volunteer_manager') {
        return 'Volunteer Manager / Coordinator';
    }

    if (staff.application_type === 'volunteer_support') {
        return 'Volunteer Support Staff';
    }

    return 'Professional Staff';
}

const filteredStaffs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return staffs.filter((staff) => {

        const matchesSearch =
            !query ||
            [
                staff.full_name,
                staff.email,
                staff.phone,
                staff.tracking_code,
                formatRole(staff),
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(query)
                );

        let matchesCategory = true;

        if (category === 'manager') {
            matchesCategory =
                staff.application_type ===
                'volunteer_manager';
        }

        if (category === 'support') {
            matchesCategory =
                staff.application_type ===
                'volunteer_support';
        }

        if (category === 'professional') {
            matchesCategory =
                staff.application_type ===
                    'professional_staff' &&
                staff.professional_role === 'staff';
        }

        return matchesSearch && matchesCategory;

    });

}, [staffs, search, category]);

function resetSearch() {
    setSearch('');
    setCategory('all');
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

                

                <div className="rounded-3xl bg-white p-6 shadow">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Approved Staff List
                        </h2>

                        <p className="text-slate-500">
                            Showing {filteredStaffs.length} approved applicant(s).
                        </p>
                    </div>

                    <div className="mb-6 grid gap-4 md:grid-cols-[1fr_280px_auto]">

    <div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
            Search approved staffs
        </label>

        <input
            type="text"
            value={search}
            onChange={(e) =>
                setSearch(e.target.value)
            }
            placeholder="Search by name, email, tracking code or role..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
        />

    </div>

    <div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
            Staff Category
        </label>

        <select
            value={category}
            onChange={(e) =>
                setCategory(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
        >
            <option value="all">
                All Staffs
            </option>

            <option value="manager">
                Volunteer Managers / Coordinators
            </option>

            <option value="support">
                Volunteer Support Staff
            </option>

            <option value="professional">
                Professional Staff
            </option>

        </select>

    </div>

    <button
        type="button"
        onClick={resetSearch}
        disabled={!search && category === 'all'}
        className="mt-auto rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-100 disabled:opacity-40"
    >
        Reset Search
    </button>

</div>

<p className="mb-6 text-sm text-slate-500">
    Showing {filteredStaffs.length} of {staffs.length} approved staff(s).
</p>

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
    <div className="flex items-center gap-3">

        {staff.applicant_photo ? (
            <img
                src={staff.applicant_photo}
                alt={staff.full_name}
                className="h-14 w-14 rounded-full border object-cover"
            />
        ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border bg-slate-100 text-xs text-slate-500">
                No Photo
            </div>
        )}

        <div>
            <div className="font-semibold text-slate-900">
                {staff.full_name}
            </div>

            <div className="text-sm text-slate-500">
                {staff.tracking_code}
            </div>
        </div>

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
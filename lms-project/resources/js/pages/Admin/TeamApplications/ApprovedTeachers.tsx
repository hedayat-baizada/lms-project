import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type Props = {
    teachers: any[];
};

export default function ApprovedTeachers({ teachers }: Props) {
    


    const [search, setSearch] = useState('');
const [category, setCategory] = useState('all');
    
function formatTeacherType(teacher: any) {
    const subject =
        teacher.teacher_subject === 'english'
            ? 'English'
            : teacher.teacher_subject === 'computer'
              ? 'Computer'
              : 'General';

    if (
        teacher.application_type === 'professional_staff' &&
        teacher.professional_role === 'teacher'
    ) {
        return `Professional ${subject} Teacher`;
    }

    return `Volunteer ${subject} Teacher`;
}



const filteredTeachers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return teachers.filter((teacher) => {
        const matchesSearch =
            !query ||
            [
                teacher.full_name,
                teacher.email,
                teacher.phone,
                teacher.tracking_code,
                formatTeacherType(teacher),
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(query),
                );

        let matchesCategory = true;

        if (category === 'volunteer_english') {
            matchesCategory =
                teacher.application_type === 'volunteer_teacher' &&
                teacher.teacher_subject === 'english';
        }

        if (category === 'volunteer_computer') {
            matchesCategory =
                teacher.application_type === 'volunteer_teacher' &&
                teacher.teacher_subject === 'computer';
        }

        if (category === 'professional_english') {
            matchesCategory =
                teacher.application_type === 'professional_staff' &&
                teacher.professional_role === 'teacher' &&
                teacher.teacher_subject === 'english';
        }

        if (category === 'professional_computer') {
            matchesCategory =
                teacher.application_type === 'professional_staff' &&
                teacher.professional_role === 'teacher' &&
                teacher.teacher_subject === 'computer';
        }

        return matchesSearch && matchesCategory;
    });
}, [teachers, search, category]);

function resetSearch() {
    setSearch('');
    setCategory('all');
}

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 p-8 text-white shadow-xl">
                    <h1 className="text-4xl font-bold">Approved Teachers</h1>
                    <p className="mt-3 text-emerald-100">
                        Approved volunteer and professional teachers ready for Member 3 to create teacher accounts.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow">

                    <div className="mb-6 grid gap-4 md:grid-cols-[1fr_280px_auto]">
    <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
            Search approved teachers
        </label>

        <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, tracking code, or teacher type..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
        />
    </div>

    <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
            Teacher Category
        </label>

        <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
        >
            <option value="all">All Teachers</option>
            <option value="volunteer_english">
                Volunteer English Teachers
            </option>
            <option value="volunteer_computer">
                Volunteer Computer Teachers
            </option>
            <option value="professional_english">
                Professional English Teachers
            </option>
            <option value="professional_computer">
                Professional Computer Teachers
            </option>
        </select>
    </div>

    <button
        type="button"
        onClick={resetSearch}
        disabled={!search && category === 'all'}
        className="mt-auto rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
        Reset Search
    </button>
</div>

<p className="mb-6 text-sm text-slate-500">
    Showing {filteredTeachers.length} of {teachers.length} approved teacher(s).
</p>
                   {filteredTeachers.length === 0 ? (
                        <p className="text-gray-500">
    No approved teachers match your search or selected category.
</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left">
                                <thead>
                                    <tr className="border-b text-sm text-gray-500">
                                        <th className="py-3">Name</th>
                                       <th className="py-3">Teacher Type</th>
                                        <th className="py-3">Email</th>
                                        <th className="py-3">WhatsApp</th>
                                        <th className="py-3">Approved Date</th>
                                        <th className="py-3 text-right">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                   {filteredTeachers.map((teacher) => (
                                        <tr key={teacher.id} className="border-b last:border-none">
                                            <td className="py-4 font-semibold">
                                                {teacher.full_name}
                                            </td>

                                           <td className="py-4">
                                                <span
                                                    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold ${
                                                        teacher.application_type === 'professional_staff' &&
                                                        teacher.professional_role === 'teacher'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-emerald-100 text-emerald-800'
                                                    }`}
                                                >
                                                    {formatTeacherType(teacher)}
                                                </span>
                                            </td>

                                            <td className="py-4">{teacher.email}</td>

                                            <td className="py-4">{teacher.phone}</td>

                                            <td className="py-4">
                                                {teacher.approved_at
                                                    ? new Date(teacher.approved_at).toLocaleDateString()
                                                    : '-'}
                                            </td>

                                            <td className="py-4 text-right">
                                                <button
                                                    type="button"
                                                    className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-900"
                                                >
                                                    Add Teacher
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <Link
                    href="/team-applications"
                    className="inline-flex rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800"
                >
                    ← Back to Team Applications
                </Link>
            </div>
        </AppLayout>
    );
}



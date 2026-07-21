import AppLayout from '@/layouts/app-layout';
import { useMemo, useState } from 'react';

type Student = {
    id: number;
    full_name: string;
    email: string;
    tracking_code: string;
    course_track: string | null;
    rejected_at?: string | null;
    updated_at?: string | null;
    applicant_photo?: string | null;
};

type Props = {
    students: Student[];
};

export default function RejectedStudents({ students }: Props) {
    const [search, setSearch] = useState('');

    const filteredStudents = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return students;
        }

        return students.filter((student) => {
            return [
                student.full_name,
                student.email,
                student.tracking_code,
                formatCourse(student.course_track),
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(query)
                );
        });
    }, [search, students]);

    function resetSearch() {
        setSearch('');
    }

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-red-900 to-rose-900 p-8 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-red-100">
                        Student Applications
                    </p>

                    <h1 className="mt-3 text-4xl font-bold">
                        Rejected Students
                    </h1>

                    <p className="mt-3 max-w-3xl text-red-100">
                        View rejected student applications. For full details,
                        search for the applicant from the main Applications page.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Search rejected students
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search by name, email, tracking code, Prep-CEL, or CEL..."
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-red-500 focus:outline-none"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={resetSearch}
                            disabled={!search}
                            className="mt-auto rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Reset Search
                        </button>
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                        Showing {filteredStudents.length} of {students.length}{' '}
                        rejected student(s).
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow">
                    {filteredStudents.length === 0 ? (
                        <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
                            No rejected students match your search.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left">
                                <thead>
                                    <tr className="border-b text-sm text-slate-500">
                                        <th className="py-3">
                                            Photo
                                        </th>
                                        <th className="py-3">
                                            Name
                                        </th>

                                        <th className="py-3">
                                            Email
                                        </th>

                                        <th className="py-3">
                                            Tracking Code
                                        </th>

                                        <th className="py-3">
                                            Course
                                        </th>

                                        <th className="py-3">
                                            Rejected On
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="border-b last:border-none"
                                        >
                                            <td className="py-4">
    {student.applicant_photo ? (
        <img
            src={student.applicant_photo}
            alt={student.full_name}
            className="h-14 w-14 rounded-full border object-cover"
        />
    ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full border bg-slate-100 text-xs text-slate-500">
            No Photo
        </div>
    )}
</td>
                                            <td className="py-4 font-semibold text-slate-900">
                                                {student.full_name}
                                            </td>

                                            <td className="py-4">
                                                {student.email}
                                            </td>

                                            <td className="py-4 font-mono text-sm">
                                                {student.tracking_code}
                                            </td>

                                            <td className="py-4">
                                                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                                                    {formatCourse(
                                                        student.course_track
                                                    )}
                                                </span>
                                            </td>

                                            <td className="py-4">
                                                {formatDate(
                                                    student.rejected_at ??
                                                        student.updated_at
                                                )}
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

function formatCourse(courseTrack: string | null) {
    if (courseTrack === 'prep_cel') {
        return 'Prep-CEL';
    }

    if (courseTrack === 'cel') {
        return 'CEL';
    }

    return '-';
}

function formatDate(value?: string | null) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleDateString();
}
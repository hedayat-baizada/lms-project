import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

type Props = {
    teachers: any[];
};

export default function ApprovedTeachers({ teachers }: Props) {
    
    
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
                    {teachers.length === 0 ? (
                        <p className="text-gray-500">No approved teachers found.</p>
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
                                    {teachers.map((teacher) => (
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
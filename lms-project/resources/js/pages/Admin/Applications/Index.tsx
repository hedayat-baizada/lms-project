import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

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
};

export default function ApplicationsIndex({ applications }: Props) {
    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Applications</h1>

                <div className="overflow-x-auto rounded border bg-white">
                    <table className="w-full text-left text-sm">
                        
                        <thead className="bg-gray-100">
                            <tr>
                                
                                <th className="p-3">Tracking Code</th>
                                <th className="p-3">Applicant</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Course</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applications.length === 0 && (
                                <tr>
                                    <td className="p-3 text-gray-500" colSpan={7}>
                                        No applications found.
                                    </td>
                                </tr>
                            )}

                            {applications.map((application) => (
                                <tr key={application.id} className="border-t">
                                    
                                    <td className="p-3">
                                        {application.tracking_code ?? '-'}
                                    </td>
                                    <td className="p-3">
                                        {application.full_name ?? '-'}
                                    </td>
                                    <td className="p-3">
                                        {application.email}
                                    </td>
                                    <td className="p-3">
                                        {application.course_category ?? '-'} /{' '}
                                        {application.course_track ??
                                            application.selected_computer_topic ??
                                            '-'}
                                    </td>
                                    <td className="p-3">
                                        <span className="rounded bg-gray-100 px-2 py-1">
                                            {application.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {new Date(application.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                       <Link
                                            href={`/applications/${application.id}`}
                                            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                                            View
                                        </Link>
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
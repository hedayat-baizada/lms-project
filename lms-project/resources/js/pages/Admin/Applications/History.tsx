import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

type Props = {
    application: any;
};

export default function ApplicationHistory({ application }: Props) {
    const logs = application.status_logs ?? [];

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white shadow-xl">
                    <Link
                        href={`/applications/${application.id}#history`}
                        className="text-sm text-blue-200 hover:underline"
                    >
                        ← Back to Application Review
                    </Link>

                    <h1 className="mt-6 text-4xl font-bold">
                        Application History
                    </h1>

                    <p className="mt-2 text-blue-100">
                        {application.full_name} — {application.tracking_code}
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Timeline
                    </h2>

                    {logs.length === 0 && (
                        <p className="mt-5 text-gray-500">
                            No history records yet.
                        </p>
                    )}

                    <div className="mt-8 space-y-6">
                        {logs.map((log: any) => (
                            <TimelineItem key={log.id} log={log} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function TimelineItem({ log }: { log: any }) {
    const color = getStatusColor(log.new_status);

    return (
        <div className="relative rounded-2xl border bg-slate-50 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${color}`}
                    >
                        {formatStatus(log.new_status)}
                    </span>

                    <p className="mt-4 font-semibold text-slate-900">
                        {formatStatus(log.old_status ?? 'none')} →{' '}
                        {formatStatus(log.new_status)}
                    </p>

                    <p className="mt-3 whitespace-pre-wrap text-slate-700">
                        {log.notes ?? 'No notes.'}
                    </p>
                </div>

                <p className="text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                </p>
            </div>
        </div>
    );
}

function formatStatus(status: string) {
    return status.replaceAll('_', ' ');
}

function getStatusColor(status: string) {
    switch (status) {
        case 'approved':
            return 'bg-green-100 text-green-800';

        case 'rejected':
            return 'bg-red-100 text-red-800';

        case 'need_correction':
            return 'bg-orange-100 text-orange-800';

        case 'correction_submitted':
            return 'bg-blue-100 text-blue-800';

        case 'waiting_review':
            return 'bg-yellow-100 text-yellow-800';

        default:
            return 'bg-gray-100 text-gray-700';
    }
}
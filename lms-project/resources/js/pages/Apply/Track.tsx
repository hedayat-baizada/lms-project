import { useForm, usePage } from '@inertiajs/react';
import { router} from '@inertiajs/react';

type Props = {
    application: any | null;
    trackingCode: string | null;
};

export default function TrackApplication() {
   const { application, trackingCode } = usePage<Props>().props;

    const form = useForm({
    tracking_code: trackingCode ?? '',
});

    function search(e: React.FormEvent) {
        e.preventDefault();

        router.get(
    '/track',
    { tracking_code: form.data.tracking_code },
    {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    }
);
    }

    function statusColor(status: string) {
        switch (status) {
            case 'waiting_review':
                return 'bg-yellow-100 text-yellow-800';

            case 'approved':
                return 'bg-green-100 text-green-800';

            case 'rejected':
                return 'bg-red-100 text-red-800';

            case 'correction_requested':
                return 'bg-orange-100 text-orange-800';

            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            <div className="mx-auto max-w-5xl">

                {/* Header */}

                <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white shadow">
                    <p className="text-sm uppercase tracking-widest text-blue-100">
                        Admissions
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        Track Your Application
                    </h1>

                    <p className="mt-2 text-blue-100">
                        Enter your tracking code to view your application status.
                    </p>
                </div>

                {/* Search */}

                <div className="mt-8 rounded-2xl bg-white p-6 shadow">
                    <form
                        onSubmit={search}
                        className="flex flex-col gap-4 md:flex-row"
                    >
                        <input
                            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-600 focus:outline-none"
                            placeholder="Example: APP-2026-0013"
                            value={form.data.tracking_code}
                            onChange={(e) =>
                                form.setData('tracking_code', e.target.value)
                            }
                        />

                        <button
                            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Track Application
                        </button>
                    </form>
                </div>

                {!application && (
                    <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow">
                        <p className="text-gray-500">
                            Enter your tracking code to view your application.
                        </p>
                    </div>
                )}

                {application && (
                    <div className="mt-8 space-y-6">

                        {/* Status */}

                        <div className="rounded-2xl bg-white p-6 shadow">

                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {application.full_name}
                                    </h2>

                                    <p className="mt-1 text-gray-500">
                                        {application.tracking_code}
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full px-4 py-2 font-semibold ${statusColor(application.status)}`}
                                >
                                    {application.status.replace('_', ' ')}
                                </span>

                            </div>
                        </div>

                        {/* Progress */}

                        <div className="rounded-2xl bg-white p-6 shadow">

                            <h3 className="mb-6 text-xl font-semibold">
                                Application Progress
                            </h3>

                            <div className="space-y-4">

                                <ProgressItem
                                    done
                                    title="Personal Information"
                                />

                                <ProgressItem
                                    done
                                    title="Course Selection"
                                />

                                <ProgressItem
                                    done
                                    title="Documents Uploaded"
                                />

                                <ProgressItem
                                    done
                                    title="Placement Test"
                                />

                                {application.course_track === 'cel' && (
                                    <>
                                        <ProgressItem
                                            done
                                            title="Writing Test"
                                        />

                                        <ProgressItem
                                            done
                                            title="Speaking Test"
                                        />
                                    </>
                                )}

                                <ProgressItem
                                    done
                                    title="Application Submitted"
                                />

                                <ProgressItem
                                    done={application.status !== 'waiting_review'}
                                    title="Reviewer Decision"
                                />

                            </div>

                        </div>

                        {/* Information */}

                        <div className="grid gap-6 md:grid-cols-2">

                            <div className="rounded-2xl bg-white p-6 shadow">
                                <h3 className="mb-4 text-xl font-semibold">
                                    Application Details
                                </h3>

                                <div className="space-y-3 text-sm">

                                    <Info
                                        label="Email"
                                        value={application.email}
                                    />

                                    <Info
                                        label="Phone"
                                        value={application.phone}
                                    />

                                    <Info
                                        label="Course"
                                        value={`${application.course_category} / ${application.course_track}`}
                                    />

                                    <Info
                                        label="Submitted"
                                        value={new Date(
                                            application.created_at
                                        ).toLocaleDateString()}
                                    />

                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow">
                                <h3 className="mb-4 text-xl font-semibold">
                                    Uploaded Documents
                                </h3>

                                <div className="space-y-2">

                                    {application.documents?.length > 0 ? (
                                        application.documents.map((doc: any) => (
                                            <div
                                                key={doc.id}
                                                className="rounded-lg border p-3"
                                            >
                                                <div className="font-medium">
                                                    {doc.document_type}
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                    {doc.document_owner_type}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">
                                            No uploaded documents.
                                        </p>
                                    )}

                                </div>
                            </div>

                        </div>

                        {/* Correction */}

                        <div className="rounded-2xl bg-white p-6 shadow">

                            <h3 className="mb-4 text-xl font-semibold">
                                Reviewer Updates
                            </h3>

                            {application.correction_requests?.length > 0 ? (
                                <div className="space-y-3">
                                    {application.correction_requests.map((request: any) => (
                                        <div key={request.id} className="rounded-xl bg-orange-50 p-4 text-orange-700">
                                            <p className="font-semibold">Correction Request</p>
                                            <p className="mt-1">{request.message}</p>
                                            <p className="mt-2 text-xs text-orange-500">
                                                {new Date(request.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    No correction requests.
                                </p>
                            )}

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

function ProgressItem({
    title,
    done,
}: {
    title: string;
    done: boolean;
}) {
    return (
        <div className="flex items-center gap-4">

            <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    done
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-white'
                }`}
            >
                {done ? '✓' : ''}
            </div>

            <div>{title}</div>

        </div>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex justify-between border-b pb-2">

            <span className="font-medium text-gray-600">
                {label}
            </span>

            <span>
                {value}
            </span>

        </div>
    );
}
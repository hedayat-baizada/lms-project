import { useForm, usePage } from '@inertiajs/react';
import { router} from '@inertiajs/react';
import { Link } from '@inertiajs/react';

type Props = {
    application: any | null;
    applicationType: 'student' | 'team' | null;
    trackingCode: string | null;
};

export default function TrackApplication() {
const {
    application,
    applicationType,
    trackingCode,
} = usePage<Props>().props;
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

            case 'need_correction':
    return 'bg-orange-100 text-orange-800';

case 'correction_submitted':
    return 'bg-blue-100 text-blue-800';

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


                        {application.status === 'rejected' && application.reviewer_notes && (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow">
        <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
                ❌
            </div>

            <div>
                <h3 className="text-xl font-bold text-red-900">
                    Application Decision
                </h3>

                <p className="text-sm text-gray-600">
                    Unfortunately, your application could not be approved.
                </p>
            </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <h4 className="font-semibold text-gray-800">
                Reason for Rejection
            </h4>

            <p className="mt-3 text-gray-700">
                {application.reviewer_notes}
            </p>
        </div>

        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h4 className="font-semibold text-blue-900">
                Need Help?
            </h4>

            <p className="mt-2 text-blue-800">
                If you have any questions regarding this decision, please contact our Admissions Office.
            </p>

            <div className="mt-4 space-y-1 text-sm text-blue-900">
                <p>
                    <strong>WhatsApp:</strong> +92 XXX XXX XXXX
                </p>

                <p>
                    <strong>Email:</strong> admissions@example.com
                </p>
            </div>
        </div>
    </div>
)}



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
                                    No correction requests have been issued for this application.
                                </p>



                            )}

                            
                                               {application.status === 'need_correction' && (
    <Link
    href={
        applicationType === 'student'
            ? `/apply/student/${application.id}/correction`
            : `/apply/team/${application.id}/correction`
    }
        className="mt-4 inline-flex rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
    >
        Submit Correction
    </Link>
)}

                            {/* {application.status === 'correction_submitted' && (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
    <h3 className="font-semibold text-blue-900">
        Correction Submitted Successfully
    </h3>

    <p className="mt-2 text-blue-700">
        Thank you. Your requested correction has been received and your
        application has been returned to our Admissions Team for another
        review.
    </p>

    <p className="mt-3 text-blue-700">
        We will notify you by email once another decision has been made.
        You can also continue to monitor your application using this
        tracking page.
    </p>
</div>
)} */}

                        </div>


        {application.status === 'approved' && (
    <StatusMessage
        color="green"
        title="Application Approved"
        message="Congratulations. Your application has been approved by the Admissions Team. The Academic Department will now prepare your student account, assign your class, and contact you with your login information and next steps."
    />
)}


{application.status === 'need_correction' && (
    <StatusMessage
        color="orange"
        title="Correction Required"
        message="Your application needs correction. Please review the message below and submit the requested update."
    />
)}

{application.status === 'correction_submitted' && (
    <StatusMessage
        color="blue"
        title="Correction Submitted"
        message="Your correction has been submitted successfully. Your application is now waiting for another review."
    />
)}

{application.status === 'waiting_review' && (
    <StatusMessage
        color="yellow"
        title="Waiting for Review"
        message="Your application has been submitted and is waiting for review by the admissions team."
    />
)}




                        {/* Progress */}

                        <div className="rounded-2xl bg-white p-6 shadow">

                            <h3 className="mb-6 text-xl font-semibold">
                                Application Progress
                            </h3>

                            <div className="space-y-4">

    {applicationType === 'student' ? (
        <>
            <ProgressItem done title="Personal Information" />
            <ProgressItem done title="Course Selection" />
            <ProgressItem done title="Documents Uploaded" />
            <ProgressItem done title="Placement Test" />

            {application.course_track === 'cel' && (
                <>
                    <ProgressItem done title="Writing Test" />
                    <ProgressItem done title="Speaking Test" />
                </>
            )}

            <ProgressItem done title="Application Submitted" />
            <ProgressItem
                done={application.status !== 'waiting_review'}
                title="Reviewer Decision"
            />
        </>
    ) : (
        <>
            <ProgressItem done title="Application Form" />
            <ProgressItem done title="Documents Uploaded" />
            <ProgressItem done title="Application Submitted" />
            <ProgressItem
                done={application.status !== 'waiting_review'}
                title="Reviewer Decision"
            />
        </>
    )}

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

                                    {applicationType === 'student' ? (
    <Info
        label="Course"
        value={`${application.course_category} / ${application.course_track}`}
    />
) : (
    <Info
        label="Role"
        value={application.application_type}
    />
)}

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


function StatusMessage({
    color,
    title,
    message,
}: {
    color: 'green' | 'red' | 'orange' | 'blue' | 'yellow';
    title: string;
    message: string;
}) {
    const colors = {
        green: 'border-green-200 bg-green-50 text-green-800',
        red: 'border-red-200 bg-red-50 text-red-800',
        orange: 'border-orange-200 bg-orange-50 text-orange-800',
        blue: 'border-blue-200 bg-blue-50 text-blue-800',
        yellow: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    };

    return (
        <div className={`rounded-2xl border p-6 shadow ${colors[color]}`}>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="mt-2">{message}</p>
        </div>
    );
}
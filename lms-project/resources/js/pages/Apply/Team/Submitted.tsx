import { Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicApplicationLayout from '@/layouts/public-application-layout';

type Props = {
    application: {
        id: number;
        full_name: string;
        tracking_code: string;
        application_type: string;
        teacher_subject: string | null;
        professional_role: 'teacher' | 'staff' | null;
    };
};

export default function Submitted({ application }: Props) {
    const [copied, setCopied] = useState(false);

    async function copyTrackingCode() {
        await navigator.clipboard.writeText(application.tracking_code);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

 function formatRole() {
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
        .replace(/\b\w/g, (character) =>
            character.toUpperCase()
        );
}

    return (
        <PublicApplicationLayout>
        <div className=" min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-3xl">

                <div className="rounded-3xl bg-white p-10 shadow-xl">

                    <div className="flex justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                            <span className="text-5xl">✓</span>
                        </div>
                    </div>

                    <h1 className="mt-8 text-center text-4xl font-bold text-slate-900">
                        Application Submitted Successfully
                    </h1>

                    <p className="mt-5 text-center text-slate-600">
                        Thank you <strong>{application.full_name}</strong> for your interest
                        in joining our academy team.
                    </p>

                    <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

                        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                            Position Applied For
                        </p>

                        <p className="mt-2 text-xl font-bold text-emerald-900">
                            {formatRole()}
                        </p>

                    </div>

                    <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">

                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                            Your Tracking Code
                        </p>

                        <div className="mt-3 flex items-center justify-between rounded-xl bg-white p-4">

                            <span className="font-mono text-xl font-bold">
                                {application.tracking_code}
                            </span>

                            <button
                                type="button"
                                onClick={copyTrackingCode}
                                className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                            >
                                Copy
                            </button>

                        </div>

                        {copied && (
                            <p className="mt-3 text-center font-medium text-green-600">
                                Tracking code copied successfully.
                            </p>
                        )}

                    </div>

                    <div className="mt-8 rounded-2xl border bg-slate-50 p-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            What happens next?
                        </h2>

                        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
                            <li>Your application will be reviewed by our admissions team.</li>

                            <li>
                                If additional information is required, you will be able to
                                submit corrections using your tracking code.
                            </li>

                            <li>
                                Please keep your tracking code safe. You will need it to
                                check the status of your application.
                            </li>
                        </ul>

                    </div>

                    <div className="mt-10 flex flex-col gap-4 md:flex-row">

                        <Link
                            href={`/track?tracking_code=${encodeURIComponent(
                                application.tracking_code
                            )}`}
                            className="flex-1 rounded-xl bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700"
                        >
                            Track My Application
                        </Link>

                        <Link
                            href="/apply"
                            className="flex-1 rounded-xl border py-3 text-center font-semibold hover:bg-slate-100"
                        >
                            Back to Home
                        </Link>

                    </div>

                </div>

            </div>
        </div>
        </PublicApplicationLayout>
    );
}
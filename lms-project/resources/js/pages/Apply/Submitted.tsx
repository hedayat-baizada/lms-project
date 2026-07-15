import { Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicApplicationLayout from '@/layouts/public-application-layout';

type Props = {
    application: any;
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


    return (
        <PublicApplicationLayout>
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-3xl">

                <div className="rounded-3xl bg-green-600 p-8 text-white shadow-xl">
                    <div className="text-6xl">🎉</div>

                    <h1 className="mt-4 text-4xl font-bold">
                        Application Submitted Successfully
                    </h1>

                    <p className="mt-3 text-green-100">
                        Thank you for applying. Your application has been received by our admissions office.
                    </p>
                </div>

                <div className="mt-8 rounded-3xl bg-white p-8 shadow">

                    <h2 className="text-2xl font-bold">
                        Your Tracking Code
                    </h2>

                    <div className="mt-5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 text-center">

                        <p className="text-sm uppercase tracking-widest text-blue-700">
                            Tracking Code
                        </p>

                        <p className="mt-3 text-4xl font-bold tracking-widest text-slate-900">
                            {application.tracking_code}
                        </p>

                    </div>

                    <button
                        onClick={copyTrackingCode}
                        className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Copy Tracking Code
                    </button>

                    {copied && (
                        <p className="mt-3 text-center text-sm font-semibold text-green-600">
                            Tracking code copied!
                        </p>
                    )}

                    <p className="mt-4 text-center text-sm text-red-600">
                        Please save this tracking code in a safe place. You will need it whenever
                        you want to check your application status.
                    </p>

                </div>

                <div className="mt-8 rounded-3xl bg-white p-8 shadow">
    <h2 className="text-2xl font-bold text-slate-900">
        What Happens Next?
    </h2>

    <div className="mt-6 space-y-8">

        <div>
            <h3 className="text-lg font-semibold text-slate-900">
                1. Application Review
            </h3>

            <p className="mt-2 text-slate-600">
                Our Admissions Team will carefully review your complete
                application, including:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
                <li>Your personal and academic information</li>
                <li>Your uploaded documents</li>
                <li>Your placement test results</li>
                <li>Your writing assessment</li>
                <li>Your speaking assessment (if applicable)</li>
            </ul>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-slate-900">
                2. Admission Decision
            </h3>

            <p className="mt-2 text-slate-600">
                After reviewing your application, one of the following
                decisions will be made:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
                <li>✅ Approved</li>
                <li>❌ Rejected</li>
                <li>📝 Correction Required (if additional information is needed)</li>
            </ul>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-slate-900">
                3. Email Notification
            </h3>

            <p className="mt-2 text-slate-600">
                Please check your email regularly.
                Once our review is complete, we will send you an email
                informing you of the decision on your application.
            </p>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-slate-900">
                4. If Your Application Is Approved
            </h3>

            <p className="mt-2 text-slate-600">
                If you are admitted, you will receive another email containing:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
                <li>Your student account information</li>
                <li>Your assigned class or placement level</li>
                <li>Instructions for accessing the student portal</li>
                <li>Additional information to help you begin your studies</li>
            </ul>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-slate-900">
                5. Track Your Application
            </h3>

            <p className="mt-2 text-slate-600">
                You do not need to submit your application again.
                Simply wait while it is being reviewed.
            </p>

            <p className="mt-3 text-slate-600">
                If you would like to check the progress of your application at
                any time, you can use your tracking code on the tracking page to
                view the latest updates.
            </p>
        </div>

    </div>

    <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h3 className="text-lg font-bold text-blue-900">
            Please Wait for Our Decision
        </h3>

        <p className="mt-2 text-blue-800">
            Your application has now entered the review stage.
            There is nothing more you need to do unless we contact you for
            additional information or corrections.
        </p>

        <p className="mt-3 text-blue-800">
            Thank you for choosing our academy.
            We appreciate your interest and look forward to reviewing your
            application.
        </p>
    </div>
</div>

                <div className="mt-10">
    <Link
        href="/track"
        className="block w-full rounded-xl bg-indigo-600 py-4 text-center text-lg font-semibold text-white transition hover:bg-indigo-700"
    >
        Track My Application
    </Link>
</div>

            </div>
        </div>
        </PublicApplicationLayout>
    );
}
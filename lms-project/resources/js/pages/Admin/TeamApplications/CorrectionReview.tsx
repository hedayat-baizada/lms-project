import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

type Props = {
    application: any;
    latestCorrectionRequest: any;
    latestCorrectionLog: any;
};

export default function TeamCorrectionReview({
    application,
    latestCorrectionRequest,
    latestCorrectionLog,
}: Props) {
    const correctedDocuments =
        application.documents?.filter((document: any) =>
            ['photo_correction', 'cv_correction'].includes(document.document_type)
        ) ?? [];

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-blue-800 to-indigo-900 p-8 text-white shadow-xl">
                    <Link
                        href={`/team-applications/${application.id}`}
                        className="text-sm text-blue-100 hover:underline"
                    >
                        ← Back to Team Application
                    </Link>

                    <h1 className="mt-6 text-4xl font-bold">
                        Correction Review
                    </h1>

                    <p className="mt-2 text-blue-100">
                        {application.full_name} — {application.tracking_code}
                    </p>
                </div>

                <Section title="Reviewer Request">
                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-orange-900">
                        <p className="whitespace-pre-wrap">
                            {latestCorrectionRequest?.message ?? 'No correction request found.'}
                        </p>

                        {latestCorrectionRequest?.created_at && (
                            <p className="mt-3 text-sm opacity-80">
                                Requested on:{' '}
                                {new Date(latestCorrectionRequest.created_at).toLocaleString()}
                            </p>
                        )}
                    </div>
                </Section>

                <Section title="Applicant Response">
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-900">
                        <p className="whitespace-pre-wrap">
                            {cleanCorrectionNote(latestCorrectionLog?.notes)}
                        </p>

                        {latestCorrectionLog?.created_at && (
                            <p className="mt-3 text-sm opacity-80">
                                Submitted on:{' '}
                                {new Date(latestCorrectionLog.created_at).toLocaleString()}
                            </p>
                        )}
                    </div>
                </Section>

                <Section title="Corrected Documents">
                    {correctedDocuments.length === 0 ? (
                        <p className="text-gray-500">
                            No corrected documents were uploaded.
                        </p>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2">
                            {correctedDocuments.map((document: any) => (
                                <div
                                    key={document.id}
                                    className="rounded-2xl border bg-slate-50 p-5"
                                >
                                    <p className="font-bold text-slate-900">
                                        {documentLabel(document.document_type)}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Uploaded:{' '}
                                        {new Date(document.created_at).toLocaleString()}
                                    </p>

                                    <a
                                        href={document.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-900"
                                    >
                                        Open Document
                                    </a>

                                    {document.file_url?.match(/\.(jpg|jpeg|png|webp)$/i) && (
                                        <img
                                            src={document.file_url}
                                            alt="Corrected upload"
                                            className="mt-4 max-h-72 rounded-xl border bg-white object-contain"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                <Section title="Decision">
                    <p className="text-slate-600">
                        After reviewing the correction, return to the main application review
                        page to approve or reject the application.
                    </p>

                    <Link
                        href={`/team-applications/${application.id}`}
                        className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Back to Decision Page
                    </Link>
                </Section>
            </div>
        </AppLayout>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold text-slate-900">{title}</h2>
            {children}
        </section>
    );
}

function cleanCorrectionNote(notes: string | null) {
    if (!notes) {
        return 'No response note found.';
    }

    return notes.replace('Applicant submitted a correction: ', '');
}

function documentLabel(type: string) {
    switch (type) {
        case 'photo_correction':
            return 'Corrected Photo';
        case 'cv_correction':
            return 'Corrected CV';
        default:
            return type.replaceAll('_', ' ');
    }
}
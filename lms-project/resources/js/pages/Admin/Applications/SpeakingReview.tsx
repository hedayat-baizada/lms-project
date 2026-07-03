import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

type Props = {
    application: any;
    speakingPrompt: {
        question_text: string;
        duration_minutes: number | null;
    } | null;
};

export default function SpeakingReview({ application, speakingPrompt }: Props) {
    const audioUrl = application.speaking_test?.audio_url;

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-8 text-white shadow-xl">
                    <Link
                        href={`/applications/${application.id}#speaking`}
                        className="text-sm text-indigo-200 hover:underline"
                    >
                        ← Back to Application Review
                    </Link>

                    <h1 className="mt-6 text-4xl font-bold">
                        Speaking Assessment
                    </h1>

                    <p className="mt-2 text-indigo-100">
                        {application.full_name}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <StatCard
                        title="Status"
                        value={audioUrl ? 'Completed' : 'Not Submitted'}
                        color="green"
                    />

                    <StatCard
                        title="Duration Limit"
                        value={`${speakingPrompt?.duration_minutes ?? 2} min`}
                        color="blue"
                    />

                    <StatCard
                        title="Attempt"
                        value={application.speaking_test?.attempt_used ? 'Used' : 'Not Used'}
                        color="amber"
                    />
                </div>

                <div className="rounded-3xl bg-white p-8 shadow">
                    <h2 className="text-2xl font-bold">
                        Speaking Prompt
                    </h2>

                    <div className="mt-4 rounded-2xl border bg-indigo-50 p-5 text-indigo-900">
                        {speakingPrompt?.question_text ?? 'No speaking prompt found.'}
                    </div>
                </div>

                {application.speaking_test?.status === 'skipped' && (
    <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-yellow-800">
        This applicant skipped the speaking assessment.
    </div>
)}

                <div className="rounded-3xl bg-white p-8 shadow">
                    <h2 className="text-2xl font-bold">
                        Applicant Recording
                    </h2>

                    {audioUrl ? (
                        <div className="mt-6 rounded-2xl border bg-slate-50 p-6">
                            <audio controls src={audioUrl} className="w-full" />

                            <a
                                href={audioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                            >
                                Open Recording
                            </a>
                        </div>
                    ) : (
                        <p className="mt-6 text-gray-500">
                            No speaking recording found.
                        </p>
                    )}
                </div>

                <div className="flex justify-end">
                    <Link
                        href={`/applications/${application.id}`}
                        className="rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white hover:bg-slate-900"
                    >
                        Back to Review
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    title,
    value,
    color,
}: {
    title: string;
    value: string | number;
    color: 'blue' | 'green' | 'amber';
}) {
    const colors = {
        blue: 'border-blue-500 bg-blue-50',
        green: 'border-green-500 bg-green-50',
        amber: 'border-amber-500 bg-amber-50',
    };

    return (
        <div className={`rounded-2xl border-l-4 p-6 shadow ${colors[color]}`}>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="mt-3 text-3xl font-bold">{value}</p>
        </div>
    );
}
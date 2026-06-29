import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

type Props = {
    application: any;
    writingPrompt: {
        question_text: string;
        word_limit: number | null;
    } | null;
};

export default function WritingReview({ application, writingPrompt }: Props) {
        const writing = application.placement_test?.writing_answer ?? '';

    const wordCount = writing
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

        const minimumWords = writingPrompt?.word_limit ?? 150;

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-8 text-white shadow-xl">

                    <Link
                        href={`/applications/${application.id}`}
                        className="text-sm text-blue-200 hover:underline"
                    >
                        ← Back to Application Review
                    </Link>

                    <h1 className="mt-6 text-4xl font-bold">
                        Writing Assessment
                    </h1>

                    <p className="mt-2 text-blue-100">
                        {application.full_name}
                    </p>

                </div>


                <div className="rounded-3xl bg-white p-8 shadow">
    <h2 className="text-2xl font-bold">
        Writing Prompt
    </h2>

    <div className="mt-4 rounded-2xl border bg-blue-50 p-5 text-blue-900">
        {writingPrompt?.question_text ?? 'No writing prompt found.'}
    </div>
</div>

                <div className="grid gap-6 md:grid-cols-3">

                    <StatCard
                        title="Status"
                        value={writing ? 'Completed' : 'Not Submitted'}
                        color="green"
                    />

                    <StatCard
                        title="Word Count"
                        value={wordCount}
                        color="blue"
                    />

                    <StatCard
                        title="Minimum"
                        value={minimumWords}
                        color="amber"
                    />

                </div>

                <div className="rounded-3xl bg-white p-8 shadow">

                    <h2 className="text-2xl font-bold">
                        Applicant Response
                    </h2>

                    <div className="mt-6 rounded-2xl border bg-slate-50 p-6 leading-8 whitespace-pre-wrap">
                        {writing || 'No writing submission found.'}
                    </div>

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
            <p className="text-sm text-gray-500">
                {title}
            </p>

            <p className="mt-3 text-3xl font-bold">
                {value}
            </p>
        </div>
    );
}
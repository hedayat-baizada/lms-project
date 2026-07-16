import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

type Props = {
    application: any;
};

export default function PlacementTestReview({ application }: Props) {
    const answers = application.placement_test?.answers ?? [];

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white shadow-xl">
                    <Link
                        href={`/applications/${application.id}#assessment`}
                        className="text-sm text-blue-200 hover:underline"
                    >
                        ← Back to Application Review
                    </Link>

                    <h1 className="mt-6 text-4xl font-bold">
                        Placement Test Review
                    </h1>

                    <p className="mt-2 text-blue-100">
                        {application.full_name} — {application.tracking_code}
                    </p>
                </div>

                <div className="rounded-3xl border bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-2xl font-bold">
                        Questions & Answers
                    </h2>

                    {answers.length === 0 && (
                        <p className="text-gray-500">No answers found.</p>
                    )}

                    <div className="space-y-5">
                        {answers.map((answer: any, index: number) => {
                            const question = answer.question;
                            const selected = answer.answer_text;
                            const correct = question?.correct_answer;
                            const isCorrect = Number(answer.score) === 1;

                            return (
                                <div
                                    key={answer.id}
                                    className="rounded-2xl border bg-slate-50 p-5"
                                >
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                        <p className="text-sm font-semibold text-blue-600">
                                            Question {index + 1}
                                        </p>

                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                                isCorrect
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {isCorrect ? 'Correct' : 'Incorrect'}
                                        </span>
                                    </div>

                                    <h3 className="mt-3 font-semibold text-slate-900">
                                        {question?.question_text ?? `Question ID: ${answer.question_id}`}
                                    </h3>

                                    {question?.question_type === 'mcq' && (
                                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                                            {(['a', 'b', 'c', 'd'] as const).map((option) => {
                                                const optionText = question[`option_${option}`];

                                                if (!optionText) return null;

                                                const isSelected = selected === option;
                                                const optionIsCorrect = correct === option;

                                                return (
                                                    <div
                                                        key={option}
                                                        className={`rounded-xl border p-3 ${
                                                            optionIsCorrect
                                                                ? 'border-green-500 bg-green-50'
                                                                : isSelected
                                                                  ? 'border-red-500 bg-red-50'
                                                                  : 'bg-white'
                                                        }`}
                                                    >
                                                        <p className="font-medium">
                                                            {option.toUpperCase()}. {optionText}
                                                        </p>

                                                        <div className="mt-1 text-sm">
                                                            {isSelected && (
                                                                <span className="mr-2 font-semibold text-blue-600">
                                                                    Applicant selected
                                                                </span>
                                                            )}

                                                            {optionIsCorrect && (
                                                                <span className="font-semibold text-green-700">
                                                                    Correct answer
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {question?.question_type !== 'mcq' && (
                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <div className="rounded-xl border bg-white p-4">
                                                <p className="text-sm font-semibold text-gray-500">
                                                    Applicant Answer
                                                </p>

                                                <p className="mt-2 whitespace-pre-wrap text-slate-800">
                                                    {selected || '-'}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                                                <p className="text-sm font-semibold text-green-700">
                                                    Correct Answer
                                                </p>

                                                <p className="mt-2 whitespace-pre-wrap text-green-900">
                                                    {correct || '-'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 rounded-xl bg-white p-3 text-sm">
                                        <p>
                                            <strong>Applicant Answer:</strong>{' '}
                                            {question?.question_type === 'mcq'
                                                ? selected?.toUpperCase() ?? '-'
                                                : selected || '-'}
                                        </p>

                                        <p>
                                            <strong>Correct Answer:</strong>{' '}
                                            {question?.question_type === 'mcq'
                                                ? correct?.toUpperCase() ?? '-'
                                                : correct || '-'}
                                        </p>

                                        <p
                                            className={
                                                isCorrect
                                                    ? 'mt-1 font-semibold text-green-700'
                                                    : 'mt-1 font-semibold text-red-700'
                                            }
                                        >
                                            {isCorrect ? 'Correct' : 'Incorrect'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Link
                    href={`/applications/${application.id}#assessment`}
                    className="inline-flex rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white hover:bg-slate-900"
                >
                    ← Back to Application Review
                </Link>
            </div>
        </AppLayout>
    );
}
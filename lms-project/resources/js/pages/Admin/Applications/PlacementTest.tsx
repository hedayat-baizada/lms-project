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
                        href={`/applications/${application.id}`}
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
                    <h2 className="mb-5 text-2xl font-bold">Questions & Answers</h2>

                    {answers.length === 0 && (
                        <p className="text-gray-500">No answers found.</p>
                    )}

                    <div className="space-y-5">
                        {answers.map((answer: any, index: number) => {
                            const question = answer.question;
                            const selected = answer.answer_text;
                            const correct = question?.correct_answer;

                            return (
                                <div key={answer.id} className="rounded-2xl border bg-slate-50 p-5">
                                    <p className="text-sm font-semibold text-blue-600">
                                        Question {index + 1}
                                    </p>

                                    <h3 className="mt-2 font-semibold text-slate-900">
                                        {question?.question_text ?? `Question ID: ${answer.question_id}`}
                                    </h3>

                                    {question?.question_type === 'mcq' && (
                                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                                            {(['a', 'b', 'c', 'd'] as const).map((option) => {
                                                const optionText = question[`option_${option}`];

                                                if (!optionText) return null;

                                                const isSelected = selected === option;
                                                const isCorrect = correct === option;

                                                return (
                                                    <div
                                                        key={option}
                                                        className={`rounded-xl border p-3 ${
                                                            isCorrect
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

                                                            {isCorrect && (
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

                                    <div className="mt-4 rounded-xl bg-white p-3 text-sm">
                                        <p>
                                            <strong>Applicant Answer:</strong>{' '}
                                            {selected ? selected.toUpperCase() : '-'}
                                        </p>

                                        <p>
                                            <strong>Correct Answer:</strong>{' '}
                                            {correct ? correct.toUpperCase() : 'Manual review'}
                                        </p>

                                        {correct && selected && (
                                            <p
                                                className={
                                                    selected === correct
                                                        ? 'mt-1 font-semibold text-green-700'
                                                        : 'mt-1 font-semibold text-red-700'
                                                }
                                            >
                                                {selected === correct ? 'Correct' : 'Incorrect'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Link
                    href={`/applications/${application.id}`}
                    className="inline-flex rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white hover:bg-slate-900"
                >
                    ← Back to Application Review
                </Link>
            </div>
        </AppLayout>
    );
}
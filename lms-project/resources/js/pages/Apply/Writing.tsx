import { useForm } from '@inertiajs/react';

type Props = {
    application: any;
    placementTest: any;
    writingPrompt: {
        question_text: string;
        word_limit: number | null;
        duration_minutes: number | null;
    } | null;
};

export default function WritingTest({ application, placementTest, writingPrompt }: Props) {    const form = useForm({
        writing_answer: placementTest.writing_answer ?? '',
    });

    const wordCount = form.data.writing_answer
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

        const minimumWords = writingPrompt?.word_limit ?? 150;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(`/apply/student/${application.id}/writing`);
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white shadow">
                    <p className="text-sm uppercase tracking-wide text-blue-100">
                        CEL Placement Writing
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                        Writing Test
                    </h1>
                    <p className="mt-2 text-blue-100">
                        Step 2 of 3 — Applicant: {application.full_name}
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow">
                    <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
                        <h2 className="text-xl font-semibold text-blue-900">
                            Writing Prompt
                        </h2>
                        <p className="mt-2 text-gray-700">
                           {writingPrompt?.question_text ?? 'How would you describe yourself?'}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                           Minimum {minimumWords} words.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="mb-2 block font-medium">
                                Your Answer
                            </label>

                            <textarea
                                rows={12}
                                className="w-full rounded-xl border border-gray-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                value={form.data.writing_answer}
                                onChange={(e) =>
                                    form.setData('writing_answer', e.target.value)
                                }
                                placeholder={`Write at least ${minimumWords} words...`}
                            />

                            <div className="mt-2 flex items-center justify-between text-sm">
                                <span
                                    className={
                                        wordCount >= minimumWords
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }
                                >
                                    Word count: {wordCount} / {minimumWords}
                                </span>

                                {form.errors.writing_answer && (
                                    <span className="text-red-600">
                                        {form.errors.writing_answer}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing || wordCount < minimumWords}
                            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            {form.processing ? 'Saving...' : 'Continue to Speaking Test'}
                        </button>
                    </form>

                    
                </div>
            </div>
        </div>
    );
}
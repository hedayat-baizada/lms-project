import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Props = {
    application: any;
    placementTest: any;
    writingPrompt: {
        question_text: string;
        word_limit: number | null;
        duration_minutes: number | null;
    } | null;
};

export default function WritingTest({ application, placementTest, writingPrompt }: Props) {
    const form = useForm({
        writing_answer: placementTest.writing_answer ?? '',
    });

    const minimumWords = writingPrompt?.word_limit ?? 150;
    const totalSeconds = (writingPrompt?.duration_minutes ?? 15) * 60;

    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
    const [started, setStarted] = useState(false);

    const wordCount = form.data.writing_answer
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    useEffect(() => {
        if (!started) return;

        const timer = window.setInterval(() => {
            setSecondsLeft((current) => {
                if (current <= 1) {
                    clearInterval(timer);
                    form.post(`/apply/student/${application.id}/writing`);
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [started]);

    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remaining = seconds % 60;

        return `${minutes}:${remaining.toString().padStart(2, '0')}`;
    }

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

                {!started && (
                    <div className="rounded-3xl bg-white p-8 shadow">
                        <h2 className="text-3xl font-bold">
                            Writing Test Instructions
                        </h2>

                        <div className="mt-6 space-y-4 text-slate-700">
                            <p>• You have <strong>{writingPrompt?.duration_minutes ?? 15} minutes</strong> to complete this writing task.</p>
                            <p>• Read the writing topic carefully before you begin.</p>
                            <p>• The recommended minimum length is <strong>{minimumWords} words</strong>.</p>
                            <p>• You may submit your answer before the timer finishes.</p>
                            <p>• When the timer reaches 0:00, your answer will be submitted automatically.</p>
                            <p>• Once you start, the timer cannot be paused or restarted.</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setStarted(true)}
                            className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Start Writing Test
                        </button>
                    </div>
                )}

                {started && (
                    <>
                        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                            <p className="text-sm uppercase tracking-wide text-red-700">
                                Writing Time Remaining
                            </p>

                            <p className="mt-2 text-4xl font-bold text-red-700">
                                {formatTime(secondsLeft)}
                            </p>

                            <p className="mt-2 text-red-600">
                                Your writing will be submitted automatically when the timer reaches zero.
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
                                    Recommended minimum: {minimumWords} words.
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
                                        placeholder="Write your answer here..."
                                    />

                                    <div className="mt-2 flex items-center justify-between text-sm">
                                        <span
                                            className={
                                                wordCount >= minimumWords
                                                    ? 'text-green-600'
                                                    : 'text-yellow-700'
                                            }
                                        >
                                            Word count: {wordCount} / {minimumWords}
                                        </span>
                                    </div>

                                    {wordCount < minimumWords && (
                                        <p className="mt-2 text-sm text-yellow-700">
                                            The recommended minimum is {minimumWords} words. You may still submit your answer, but it may affect your evaluation.
                                        </p>
                                    )}

                                    {form.errors.writing_answer && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {form.errors.writing_answer}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    {form.processing ? 'Saving...' : 'Continue to Speaking Test'}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
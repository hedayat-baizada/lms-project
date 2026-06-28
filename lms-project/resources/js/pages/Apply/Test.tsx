import axios from 'axios';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Question = {
    test_question_id: number;
    id: number;
    display_order: number;
    question_text: string;
    question_type: string;
    option_a: string | null;
    option_b: string | null;
    option_c: string | null;
    option_d: string | null;
};

type PageProps = {
    application: {
        id: number;
        full_name: string;
    };
    placementTest: {
        id: number;
        test_code: string;
        expires_at: string;
    };
    questions: Question[];
    existingAnswers: Record<number, string>;
};

export default function PlacementTestPage() {
    const { application, placementTest, questions, existingAnswers } =
        usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm<{
        answers: Record<number, string>;
    }>({
        answers: existingAnswers ?? {},
    });

    const [secondsLeft, setSecondsLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

    const saveTimer = useRef<number | null>(null);

    function saveDrafts(answers: Record<number, string>) {
        setSaveStatus('saving');

        axios
            .post(`/apply/student/${application.id}/test/drafts`, {
                answers,
            })
            .then(() => setSaveStatus('saved'))
            .catch(() => setSaveStatus('unsaved'));
    }

    function setAnswer(testQuestionId: number, value: string) {
        const nextAnswers = {
            ...data.answers,
            [testQuestionId]: value,
        };

        setData('answers', nextAnswers);
        setSaveStatus('unsaved');

        if (saveTimer.current) {
            clearTimeout(saveTimer.current);
        }

        saveTimer.current = window.setTimeout(() => {
            saveDrafts(nextAnswers);
        }, 3000);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (saveTimer.current) {
            clearTimeout(saveTimer.current);
        }

        setSubmitted(true);

        post(`/apply/student/${application.id}/test`);
    }

    useEffect(() => {
        const expiryTime = new Date(placementTest.expires_at).getTime();

        function updateTimer() {
            const now = new Date().getTime();
            const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));

            setSecondsLeft(remaining);

            if (remaining === 0 && !submitted) {
                if (saveTimer.current) {
                    clearTimeout(saveTimer.current);
                }

                setSubmitted(true);
                post(`/apply/student/${application.id}/test`);
            }
        }

        updateTimer();

        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [application.id, placementTest.expires_at, post, submitted]);

    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white shadow">
                    <p className="text-sm uppercase tracking-wide text-blue-100">
                        Placement Test
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Online Placement Test
                    </h1>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-blue-100">
                                Applicant: {application.full_name}
                            </p>
                            <p className="text-blue-100">
                                Test Code: {placementTest.test_code}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/15 px-5 py-3 text-lg font-bold">
                            Time Left: {formatTime(secondsLeft)}
                        </div>
                    </div>
                </div>

                <div className="mb-4 rounded-xl border bg-white px-5 py-3 text-sm shadow-sm">
                    {saveStatus === 'saving' && (
                        <span className="text-blue-600">Saving answers...</span>
                    )}

                    {saveStatus === 'saved' && (
                        <span className="text-green-600">All changes saved</span>
                    )}

                    {saveStatus === 'unsaved' && (
                        <span className="text-yellow-600">Unsaved changes</span>
                    )}
                </div>

                {errors.answers && (
                    <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
                        {errors.answers}
                    </p>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {questions.map((question) => (
                        <div
                            key={question.test_question_id}
                            className="rounded-2xl border bg-white p-6 shadow-sm"
                        >
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                {question.display_order}. {question.question_text}
                            </h2>

                            {question.question_type === 'mcq' && (
                                <div className="space-y-3">
                                    {(['a', 'b', 'c', 'd'] as const).map((option) => (
                                        <label
                                            key={option}
                                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                                                data.answers[question.test_question_id] === option
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question_${question.test_question_id}`}
                                                value={option}
                                                checked={
                                                    data.answers[question.test_question_id] === option
                                                }
                                                onChange={(e) =>
                                                    setAnswer(
                                                        question.test_question_id,
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1"
                                            />

                                            <span>
                                                <strong>{option.toUpperCase()}.</strong>{' '}
                                                {question[`option_${option}` as keyof Question]}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {question.question_type === 'text' && (
                                <textarea
                                    className="w-full rounded-xl border p-3"
                                    rows={3}
                                    value={data.answers[question.test_question_id] ?? ''}
                                    onChange={(e) =>
                                        setAnswer(question.test_question_id, e.target.value)
                                    }
                                />
                            )}
                        </div>
                    ))}

                    <div className="sticky bottom-4 rounded-2xl border bg-white p-4 shadow-lg">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {processing ? 'Submitting...' : 'Submit Test'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
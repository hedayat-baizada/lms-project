import axios from 'axios';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Question = {
    test_question_id: number;
    id: number;
    display_order: number;
    question_text: string;
    question_type: string;
    passage_number: number | null;
    blank_number: number | null;
    passage_text: string | null;
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
    const warningMessage =
        'Your placement test is in progress. If you leave, the timer will continue running.';

    function handleBeforeUnload(e: BeforeUnloadEvent) {
        if (submitted) return;

        e.preventDefault();
        e.returnValue = warningMessage;

        return warningMessage;
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
}, [submitted]);




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
    {Object.values(
        questions.reduce((groups: Record<string, Question[]>, question) => {
            const key = question.passage_number
                ? `passage_${question.passage_number}`
                : `question_${question.test_question_id}`;

            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(question);

            return groups;
        }, {})
    ).map((group) => {
        const firstQuestion = group[0];
        const isPassageGroup = firstQuestion.passage_number !== null;

        if (isPassageGroup) {
            return (
                <div
                    key={`passage_${firstQuestion.passage_number}`}
                    className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                    <p className="text-sm font-semibold text-blue-600">
                        Passage {firstQuestion.passage_number}
                    </p>

                    <div className="mt-4 rounded-xl bg-slate-50 p-5 leading-8 text-slate-800">
                        {firstQuestion.passage_text}
                    </div>

                    <div className="mt-6 space-y-5">
                        {group
                            .sort((a, b) => (a.blank_number ?? 0) - (b.blank_number ?? 0))
                            .map((question) => (
                                <div
                                    key={question.test_question_id}
                                    className="rounded-xl border bg-slate-50 p-4"
                                >
                                    <h3 className="font-semibold text-slate-900">
                                        Blank {question.blank_number}
                                    </h3>

                                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                                        {[
                                            ['a', question.option_a],
                                            ['b', question.option_b],
                                            ['c', question.option_c],
                                            ['d', question.option_d],
                                        ].map(([value, label]) => (
                                            <label
                                                key={value}
                                                className="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-4 hover:bg-blue-50"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question_${question.test_question_id}`}
                                                    value={value ?? ''}
                                                    checked={
                                                        data.answers[question.test_question_id] === value
                                                    }
                                                    onChange={() =>
                                                        setAnswer(question.test_question_id, value ?? '')
                                                    }
                                                />

                                                <span>
                                                    {value?.toUpperCase()}. {label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            );
        }

        const question = firstQuestion;

        return (
            <div
                key={question.test_question_id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
            >
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    {question.display_order}. {question.question_text}
                </h2>

                {question.question_type === 'mcq' ? (
                    <div className="mt-4 space-y-3">
                        {[
                            ['a', question.option_a],
                            ['b', question.option_b],
                            ['c', question.option_c],
                            ['d', question.option_d],
                        ].map(([value, label]) => (
                            <label
                                key={value}
                                className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 hover:bg-blue-50"
                            >
                                <input
                                    type="radio"
                                    name={`question_${question.test_question_id}`}
                                    value={value ?? ''}
                                    checked={
                                        data.answers[question.test_question_id] === value
                                    }
                                    onChange={() =>
                                        setAnswer(question.test_question_id, value ?? '')
                                    }
                                />

                                <span>
                                    {value?.toUpperCase()}. {label}
                                </span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <div className="mt-4">
                        <textarea
                            rows={4}
                            className="w-full rounded-xl border p-4"
                            value={data.answers[question.test_question_id] ?? ''}
                            onChange={(e) =>
                                setAnswer(question.test_question_id, e.target.value)
                            }
                            placeholder="Write your answer here..."
                        />
                    </div>
                )}
            </div>
        );
    })}

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
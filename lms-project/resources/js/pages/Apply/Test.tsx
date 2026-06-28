import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';


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
};

export default function PlacementTestPage() {
    const { application, placementTest, questions, existingAnswers } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm<{
        answers: Record<number, string>;
    }>({
       answers: existingAnswers ?? {},
    });

    const [secondsLeft, setSecondsLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);

   function setAnswer(testQuestionId: number, value: string) {
    setData('answers', {
        ...data.answers,
        [testQuestionId]: value,
    });

    router.post(
        `/apply/student/${application.id}/test/draft`,
        {
            test_question_id: testQuestionId,
            answer_text: value,
        },
        {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        }
    );
}

    function submit(e: React.FormEvent) {
    e.preventDefault();

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
            setSubmitted(true);
            post(`/apply/student/${application.id}/test`);
        }
    }

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
}, []);

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="mx-auto max-w-4xl bg-white p-8 rounded shadow">
                <h1 className="text-3xl font-bold mb-2">Placement Test</h1>

                <p className="text-gray-600 mb-2">
                    Applicant: {application.full_name}
                </p>

                <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                    Test Code: {placementTest.test_code}
                </p>

                <div className="rounded bg-red-100 px-4 py-2 font-bold text-red-700">
                    Time Left: {formatTime(secondsLeft)}
                </div>
            </div>

                {errors.answers && (
                    <p className="mb-4 text-red-600">{errors.answers}</p>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {questions.map((question) => (
                        <div key={question.test_question_id} className="border rounded p-4">
                            <h2 className="font-semibold mb-3">
                                {question.display_order}. {question.question_text}
                            </h2>

                            {question.question_type === 'mcq' && (
                                <div className="space-y-2">
                                    {(['a', 'b', 'c', 'd'] as const).map((option) => (
                                        <label key={option} className="block">
                                            <input
                                                type="radio"
                                                name={`question_${question.test_question_id}`}
                                                value={option}
                                                checked={data.answers[question.test_question_id] === option}
                                                onChange={(e) =>
                                                    setAnswer(question.test_question_id, e.target.value)
                                                }
                                            />{' '}
                                            {option.toUpperCase()}.{' '}
                                            {question[`option_${option}` as keyof Question]}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {question.question_type === 'text' && (
                                <textarea
                                    className="w-full border rounded p-2"
                                    rows={3}
                                    value={data.answers[question.test_question_id] ?? ''}
                                    onChange={(e) =>
                                        setAnswer(question.test_question_id, e.target.value)
                                    }
                                />
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-3 rounded"
                    >
                        {processing ? 'Submitting...' : 'Submit Test'}
                    </button>
                </form>
            </div>
        </div>
    );
}
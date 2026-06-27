import { usePage } from '@inertiajs/react';

type Question = {
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
    const { application, placementTest, questions } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="mx-auto max-w-4xl bg-white p-8 rounded shadow">
                <h1 className="text-3xl font-bold mb-2">Placement Test</h1>

                <p className="text-gray-600 mb-2">
                    Applicant: {application.full_name}
                </p>

                <p className="text-gray-600 mb-6">
                    Test Code: {placementTest.test_code}
                </p>

                <div className="space-y-6">
                    {questions.map((question) => (
                        <div key={question.id} className="border rounded p-4">
                            <h2 className="font-semibold mb-3">
                                {question.display_order}. {question.question_text}
                            </h2>

                            {question.question_type === 'mcq' && (
                                <div className="space-y-2">
                                    <label className="block">
                                        <input type="radio" name={`question_${question.id}`} /> A. {question.option_a}
                                    </label>

                                    <label className="block">
                                        <input type="radio" name={`question_${question.id}`} /> B. {question.option_b}
                                    </label>

                                    <label className="block">
                                        <input type="radio" name={`question_${question.id}`} /> C. {question.option_c}
                                    </label>

                                    <label className="block">
                                        <input type="radio" name={`question_${question.id}`} /> D. {question.option_d}
                                    </label>
                                </div>
                            )}

                            {question.question_type === 'text' && (
                                <textarea className="w-full border rounded p-2" rows={3} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
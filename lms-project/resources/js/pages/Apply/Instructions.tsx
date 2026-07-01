import { Link } from '@inertiajs/react';

type Props = {
    application: any;
    placementTest: any | null;
};

export default function Instructions({ application, placementTest }: Props) {
        const isCel = application.course_track === 'cel';

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="rounded-3xl bg-gradient-to-r from-blue-800 to-indigo-900 p-8 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
                        Placement Assessment
                    </p>

                    <h1 className="mt-3 text-4xl font-bold">
                        Test Instructions
                    </h1>

                    <p className="mt-3 text-blue-100">
                        Please read the instructions carefully before starting.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow">
                    <h2 className="text-2xl font-bold text-slate-900">
                        General Rules
                    </h2>

                    <div className="mt-5 space-y-3 text-slate-700">
                        <p>• Once you start the test, the timer will begin immediately.</p>
                        <p>• Do not refresh or close the browser during the test unless necessary.</p>
                        <p>• Your answers may be saved during the test, but you should still complete everything carefully.</p>
                        <p>• When the time finishes, the test may be submitted automatically.</p>
                        <p>• Use a stable internet connection and a quiet place.</p>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow">
                    <h2 className="text-2xl font-bold text-slate-900">
                        MCQ Test
                    </h2>

                    <div className="mt-5 space-y-3 text-slate-700">
                        <p>• You will answer multiple-choice questions.</p>
                        <p>• Choose the best answer for each question.</p>
                        <p>• You cannot change the test after final submission.</p>
                        <p>
                            • Time limit:{' '}
                            <strong>{isCel ? '80 minutes for CEL' : '50 minutes for Prep-CEL'}</strong>.
                        </p>
                    </div>
                </div>

                {isCel && (
                    <>
                        <div className="rounded-3xl bg-white p-8 shadow">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Writing Test
                            </h2>

                            <div className="mt-5 space-y-3 text-slate-700">
                                <p>• After the MCQ test, you will complete a writing task.</p>
                                <p>• Read the writing topic carefully.</p>
                                <p>• Write at least the required minimum number of words.</p>
                                <p>• Your writing will be reviewed manually by the admissions reviewer.</p>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-8 shadow">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Speaking Test
                            </h2>

                            <div className="mt-5 space-y-3 text-slate-700">
                                <p>• You will have one speaking attempt only.</p>
                                <p>• Recording starts immediately after you click Begin Speaking Test.</p>
                                <p>• You cannot pause, stop, restart, or re-record.</p>
                                <p>• When the timer finishes, your recording will upload automatically.</p>
                                <p>• Please allow microphone access before starting.</p>
                            </div>
                        </div>
                    </>
                )}



                {placementTest?.status === 'in_progress' && (
                    <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 text-orange-900">
                        <h3 className="text-lg font-bold">
                            Your test is already in progress
                        </h3>

                        <p className="mt-2">
                            You can resume your test, but the timer has continued running since you started it.
                        </p>
                    </div>
                )}

                <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-900">
                    <h3 className="text-lg font-bold">
                        Important
                    </h3>

                    <p className="mt-2">
                        By continuing, you confirm that you understand the assessment rules and are ready to begin.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Link
                        href={`/apply/student/${application.id}/course`}
                        className="rounded-xl border bg-white px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        ← Back to Course Selection
                    </Link>

                    <Link
                        href={`/apply/student/${application.id}/test`}
                        className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
                    >
                        {placementTest?.status === 'in_progress'
                            ? 'Resume Test →'
                            : placementTest?.status === 'submitted'
                            ? 'Continue →'
                            : 'I Understand, Start Test →'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
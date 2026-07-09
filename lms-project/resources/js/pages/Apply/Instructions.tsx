import { Link } from '@inertiajs/react';
import { celLevels, prepCelLevels } from '@/data/courseDescriptions';

type Props = {
    application: any;
    placementTest: any | null;
};

export default function Instructions({ application, placementTest }: Props) {
        const isCel = application.course_track === 'cel';



//         const prepCelLevels = [
//     {
//         title: 'English Time 1 — A1',
//         summary: 'For absolute beginners learning English for the first time.',
//         details: 'Students learn greetings, classroom expressions, basic vocabulary, numbers, colors, family members, animals, simple questions, and short sentences.',
//     },
//     {
//         title: 'English Time 2 — A2',
//         summary: 'For students who can use simple English and want to improve everyday communication.',
//         details: 'Students describe people, places, routines, preferences, read short passages, write simple sentences, and improve confidence in daily communication.',
//     },
//     {
//         title: 'English Time 3 — A3',
//         summary: 'For learners who want to communicate more confidently.',
//         details: 'Students talk about daily life, hobbies, school, family, use simple present and past forms, read short texts, and write organized paragraphs.',
//     },
//     {
//         title: 'English Time 4 — A4',
//         summary: 'Develops reading, writing, listening, and speaking skills through communicative activities.',
//         details: 'Students improve grammar accuracy, daily vocabulary, pronunciation, paragraph writing, and short text comprehension.',
//     },
//     {
//         title: 'English Time 5 — A5',
//         summary: 'Strengthens communication through real-life topics and interactive lessons.',
//         details: 'Students practice culture, travel, technology, health, reading passages, speaking fluency, writing, grammar, and collaborative activities.',
//     },
//     {
//         title: 'English Time 6 — A6',
//         summary: 'Advanced elementary level preparing students for higher-level English learning.',
//         details: 'Students improve independent communication, advanced grammar, vocabulary, reading, writing, speaking, and academic English skills.',
//     },
// ];

// const celLevels = [
//     {
//         title: 'Beginner',
//         summary: 'For learners with little prior knowledge of English.',
//         details: 'Students learn basic communication, personal information, family, daily routines, shopping, food, travel, grammar, vocabulary, and pronunciation.',
//     },
//     {
//         title: 'Elementary',
//         summary: 'For learners who want to strengthen basic English for everyday communication.',
//         details: 'Students improve speaking, listening, reading, writing, present/past/future forms, and vocabulary for daily life.',
//     },
//     {
//         title: 'Pre-Intermediate',
//         summary: 'For learners developing greater fluency and accuracy.',
//         details: 'Students discuss travel, technology, relationships, education, health, work, opinions, experiences, and wider grammar structures.',
//     },
//     {
//         title: 'Intermediate',
//         summary: 'For learners improving English for academic, professional, and social purposes.',
//         details: 'Students work with culture, careers, education, travel, global issues, discussions, problem solving, and organized writing.',
//     },
//     {
//         title: 'Intermediate Plus',
//         summary: 'For learners between Intermediate and Upper-Intermediate.',
//         details: 'Students strengthen fluency, confidence, grammar control, vocabulary range, speaking, writing, and academic communication.',
//     },
//     {
//         title: 'Upper Intermediate',
//         summary: 'For learners refining English for academic, professional, and intercultural communication.',
//         details: 'Students analyze complex issues, use advanced grammar and vocabulary, deliver presentations, and write organized assignments.',
//     },
// ];

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




<div className="mt-8 rounded-3xl bg-white p-8 shadow">
    <h2 className="text-2xl font-bold text-slate-900">
        About Our English Levels
    </h2>

    <p className="mt-3 text-slate-600">
        You do not need to know your exact level before taking the placement test.
        These descriptions are here to help you understand our courses. Our reviewers
        will recommend the most suitable level based on your placement test result.
    </p>

   <div className="mt-6 space-y-4">
    {(application.course_track === 'cel' ? celLevels : prepCelLevels).map((level) => (
        <details
            key={level.title}
            className="rounded-2xl border bg-slate-50 p-5"
        >
            <summary className="cursor-pointer text-lg font-bold text-slate-900">
                {level.title}
            </summary>

            <div className="mt-5 space-y-5 text-slate-700">
                <div>
                    <h3 className="font-bold text-slate-900">
                        Course Description
                    </h3>

                    <p className="mt-2 leading-7">
                        {level.courseDescription}
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-slate-900">
                        Course Objectives
                    </h3>

                    <ul className="mt-2 list-disc space-y-1 pl-6">
                        {level.objectives.map((objective) => (
                            <li key={objective}>{objective}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-slate-900">
                        Assessment Methods
                    </h3>

                    <ul className="mt-2 list-disc space-y-1 pl-6">
                        {level.assessmentMethods.map((method) => (
                            <li key={method}>{method}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </details>
    ))}
</div>
</div>





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
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ChooseRole() {
    const [teacherTrack, setTeacherTrack] = useState('');

    return (
        <div className="min-h-screen bg-slate-100 py-12">
            <div className="mx-auto max-w-6xl px-6">

                <Link
                    href="/apply"
                    className="text-blue-600 hover:underline"
                >
                    ← Back
                </Link>

                <div className="mt-6 rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-700 p-10 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">
                        Academy Team
                    </p>

                    <h1 className="mt-3 text-4xl font-bold">
                        Apply to Join the Academy Team
                    </h1>

                    <p className="mt-4 max-w-3xl text-emerald-100">
                        Choose how you would like to contribute to the academy.
                        You can volunteer your time or apply for a professional position.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-2">

                    {/* Volunteer Teacher */}

                    <div className="rounded-3xl bg-white p-8 shadow">

                        <h2 className="text-2xl font-bold">
                            Volunteer Teacher
                        </h2>

                        <p className="mt-3 text-slate-600">
                            Teach students voluntarily in online or physical classes.
                        </p>

                        <select
                            value={teacherTrack}
                            onChange={(e) => setTeacherTrack(e.target.value)}
                            className="mt-6 w-full rounded-xl border p-3"
                        >
                            <option value="">
                                Select subject
                            </option>

                            <option value="english">
                                English Teacher
                            </option>

                            <option value="computer">
                                Computer Teacher
                            </option>
                        </select>

                        <button
                            disabled={!teacherTrack}
                            className="mt-6 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white disabled:bg-gray-400"
                        >
                            Continue
                        </button>

                    </div>

                    {/* Volunteer Manager */}

                    <div className="rounded-3xl bg-white p-8 shadow">

                        <h2 className="text-2xl font-bold">
                            Volunteer Manager / Coordinator
                        </h2>

                        <p className="mt-3 text-slate-600">
                            Help manage students, classes, attendance,
                            communication and academy operations.
                        </p>

                        <button
                            className="mt-10 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white"
                        >
                            Continue
                        </button>

                    </div>

                    {/* Volunteer Support */}

                    <div className="rounded-3xl bg-white p-8 shadow">

                        <h2 className="text-2xl font-bold">
                            Volunteer Support Staff
                        </h2>

                        <p className="mt-3 text-slate-600">
                            Help with administration, technology,
                            documentation, events and application processing.
                        </p>

                        <button
                            className="mt-10 w-full rounded-xl bg-purple-600 py-3 font-semibold text-white"
                        >
                            Continue
                        </button>

                    </div>

                    {/* Professional */}

                    <div className="rounded-3xl bg-white p-8 shadow">

                        <h2 className="text-2xl font-bold">
                            Professional Teacher / Staff
                        </h2>

                        <p className="mt-3 text-slate-600">
                            Apply for a formal teaching or staff position when
                            vacancies are available.
                        </p>

                        <button
                            className="mt-10 w-full rounded-xl bg-orange-600 py-3 font-semibold text-white"
                        >
                            Continue
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}
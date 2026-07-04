import StatCard from '@/components/dashboard/stat-card';
import {
    GraduationCap,
    BookOpen,
    Award,
    Bell,
} from 'lucide-react';

type Props = {
    stats: any;
};

export default function StudentDashboard({ stats }: Props) {
    return (
        <div className="space-y-6">

            {/* HERO SECTION */}
            <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8 text-white shadow-2xl">

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <p className="text-cyan-300 text-sm uppercase tracking-widest">
                            Alfa Educational Society
                        </p>

                        <h1 className="mt-2 text-5xl font-black">
                            Student Dashboard
                        </h1>

                        <p className="mt-4 max-w-2xl text-slate-300">
                            Track your attendance, courses, academic results,
                            and important announcements in one place.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 lg:mt-0">

                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <p className="text-sm text-slate-300">
                                Attendance
                            </p>

                            <p className="text-3xl font-bold">
                                92%
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <p className="text-sm text-slate-300">
                                Courses
                            </p>

                            <p className="text-3xl font-bold">
                                5
                            </p>
                        </div>

                    </div>

                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid gap-4 md:grid-cols-4">

                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Academic Status
                    </p>

                    <p className="mt-2 font-semibold text-green-600">
                        Good Standing
                    </p>
                </div>

                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Courses Enrolled
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        5
                    </p>
                </div>

                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Result Cards
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        4
                    </p>
                </div>

                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Announcements
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        3
                    </p>
                </div>

            </div>

            {/* MAIN STATS */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Attendance %"
                    value="92%"
                    icon={
                        <GraduationCap className="h-6 w-6 text-emerald-600" />
                    }
                />

                <StatCard
                    title="Courses"
                    value="5"
                    icon={
                        <BookOpen className="h-6 w-6 text-blue-600" />
                    }
                />

                <StatCard
                    title="Result Cards"
                    value="4"
                    icon={
                        <Award className="h-6 w-6 text-violet-600" />
                    }
                />

                <StatCard
                    title="Announcements"
                    value="3"
                    icon={
                        <Bell className="h-6 w-6 text-orange-600" />
                    }
                />

            </div>

            {/* PANELS */}
            <div className="grid gap-6 lg:grid-cols-2">

                <div className="rounded-2xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Upcoming Activities
                    </h2>

                    <ul className="space-y-3">
                        <li>• Mathematics Quiz - Friday</li>
                        <li>• Science Assignment Submission</li>
                        <li>• Attendance Review Meeting</li>
                        <li>• Monthly Assessment Test</li>
                    </ul>
                </div>

                <div className="rounded-2xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Recent Updates
                    </h2>

                    <div className="space-y-5">

                        <div className="flex items-start gap-4">
                            <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />

                            <div>
                                <p className="font-medium">
                                    New result card published
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    Today
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />

                            <div>
                                <p className="font-medium">
                                    Attendance updated
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    Yesterday
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 h-3 w-3 rounded-full bg-purple-500" />

                            <div>
                                <p className="font-medium">
                                    New announcement posted
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    2 days ago
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
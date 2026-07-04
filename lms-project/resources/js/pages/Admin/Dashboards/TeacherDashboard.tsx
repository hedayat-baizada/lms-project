import StatCard from '@/components/dashboard/stat-card';
import {
    BookOpen,
    Users,
    ClipboardCheck,
    FileText,
} from 'lucide-react';

type Props = {
    stats: any;
};

export default function TeacherDashboard({ stats }: Props) {
    return (
        <div className="space-y-6">

            {/* HERO */}
            <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8 text-white shadow-2xl">

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <p className="text-cyan-300 text-sm uppercase tracking-widest">
                            Academic Department
                        </p>

                        <h1 className="mt-2 text-5xl font-black">
                            Teacher Dashboard
                        </h1>

                        <p className="mt-4 max-w-2xl text-slate-300">
                            Manage classes, attendance, student performance,
                            assessments and academic progress from one place.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 lg:mt-0">

                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <p className="text-sm text-slate-300">
                                My Classes
                            </p>

                            <p className="text-3xl font-bold">
                                4
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <p className="text-sm text-slate-300">
                                Students
                            </p>

                            <p className="text-3xl font-bold">
                                86
                            </p>
                        </div>

                    </div>

                </div>

            </div>



            {/* MAIN CARDS */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="My Classes"
                    value="4"
                    icon={<BookOpen className="h-6 w-6 text-blue-600" />}
                />

                <StatCard
                    title="Students"
                    value="86"
                    icon={<Users className="h-6 w-6 text-emerald-600" />}
                />

                <StatCard
                    title="Attendance Today"
                    value="91%"
                    icon={<ClipboardCheck className="h-6 w-6 text-violet-600" />}
                />

                <StatCard
                    title="Pending Results"
                    value="7"
                    icon={<FileText className="h-6 w-6 text-orange-600" />}
                />

            </div>

            {/* ACTIVITY SECTION */}
            <div className="grid gap-6 lg:grid-cols-2">

                <div className="rounded-2xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Today's Tasks
                    </h2>

                    <ul className="space-y-3">
                        <li>• Mark attendance for 4 classes</li>
                        <li>• Review 7 pending results</li>
                        <li>• Upload lesson materials</li>
                    </ul>
                </div>

                <div className="rounded-2xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Recent Activity
                    </h2>

                    <div className="space-y-5">

                        <div className="flex items-start gap-4">
                            <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />

                            <div>
                                <p className="font-medium">
                                    Attendance submitted
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    10 minutes ago
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />

                            <div>
                                <p className="font-medium">
                                    New assignment uploaded
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    25 minutes ago
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 h-3 w-3 rounded-full bg-purple-500" />

                            <div>
                                <p className="font-medium">
                                    Results published
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    1 hour ago
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
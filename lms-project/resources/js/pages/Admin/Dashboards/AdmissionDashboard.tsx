import StatCard from '@/components/dashboard/stat-card';
import {
    FileText,
    ClipboardCheck,
    Users,
    GraduationCap,
} from 'lucide-react';

type Props = {
    stats: any;
};

export default function AdmissionDashboard({ stats }: Props) {
    return (
        <div className="space-y-6">

            {/* HERO SECTION */}
            <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8 text-white shadow-2xl">

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <p className="text-cyan-300 text-sm uppercase tracking-widest">
                            Admissions Department
                        </p>

                        <h1 className="mt-2 text-5xl font-black">
                            Admission Dashboard
                        </h1>

                        <p className="mt-4 max-w-2xl text-slate-300">
                            Manage student applications, placement tests,
                            interviews, admissions approvals and enrollment
                            activities.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 lg:mt-0">

                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <p className="text-sm text-slate-300">
                                Applications
                            </p>

                            <p className="text-3xl font-bold">
                                {stats.applications}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <p className="text-sm text-slate-300">
                                New Students
                            </p>

                            <p className="text-3xl font-bold">
                                9
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* QUICK STATS */}
            <div className="grid gap-4 md:grid-cols-4">

                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Pending Applications
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {stats.applications}
                    </p>
                </div>

                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Placement Tests
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        18
                    </p>
                </div>

                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Interviews
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        12
                    </p>
                </div>

                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        New Admissions
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        9
                    </p>
                </div>

            </div>

            {/* MAIN STAT CARDS */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Applications"
                    value={stats.applications}
                    icon={<FileText className="h-6 w-6 text-blue-600" />}
                />

                <StatCard
                    title="Placement Tests"
                    value="18"
                    icon={<ClipboardCheck className="h-6 w-6 text-emerald-600" />}
                />

                <StatCard
                    title="Interviews"
                    value="12"
                    icon={<Users className="h-6 w-6 text-violet-600" />}
                />

                <StatCard
                    title="New Students"
                    value="9"
                    icon={<GraduationCap className="h-6 w-6 text-orange-600" />}
                />

            </div>

            {/* ACTIVITY + TASKS */}
            <div className="grid gap-6 lg:grid-cols-2">

                <div className="rounded-2xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Pending Tasks
                    </h2>

                    <ul className="space-y-3">
                        <li>• {stats.applications} applications awaiting review</li>
                        <li>• 12 interviews scheduled this week</li>
                        <li>• 18 placement tests awaiting evaluation</li>
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
                                    New application submitted
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    5 minutes ago
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />

                            <div>
                                <p className="font-medium">
                                    Interview scheduled
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    15 minutes ago
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 h-3 w-3 rounded-full bg-purple-500" />

                            <div>
                                <p className="font-medium">
                                    Application approved
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    30 minutes ago
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
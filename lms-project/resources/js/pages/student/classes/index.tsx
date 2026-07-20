import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Classes', href: '/student/classes' },
];

interface StudentClass {
    id: number;
    name: string;
    type: string;
    total_lessons: number;
    completed_lessons: number;
    percentage: number;
    status: string;
}

export default function StudentClasses() {
    const { auth } = usePage<SharedData>().props;
    const [classes, setClasses] = useState<StudentClass[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/my-classes', {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setClasses(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Classes" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6">

                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-slate-800">📚 My Classes</h1>
                        <span className="text-sm text-slate-400 bg-white/70 px-4 py-2 rounded-full shadow-sm border border-slate-200">
                            {loading ? 'Loading...' : `${classes.length} class(es)`}
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    ) : classes.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-slate-500 text-lg">You are not enrolled in any class yet.</p>
                            <p className="text-slate-400 text-sm mt-1">Join a class to start learning!</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {classes.map(cls => (
                                <div
                                    key={cls.id}
                                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-slate-200/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800">{cls.name}</h2>
                                                <p className="text-sm text-slate-500 mt-0.5">
                                                    {cls.total_lessons} lesson{cls.total_lessons !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                                                cls.type === 'english'
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'bg-green-50 text-green-700 border border-green-200'
                                            }`}>
                                                {cls.type === 'english' ? '🇬🇧 English' : '💻 Computer'}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                                <span>{cls.completed_lessons} / {cls.total_lessons} completed</span>
                                                <span className="font-semibold">{cls.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className="h-2.5 rounded-full transition-all duration-700 bg-gradient-to-r from-indigo-500 to-purple-500"
                                                    style={{ width: `${cls.percentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            className="mt-2 w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                                            onClick={() => router.visit(`/student/classes/${cls.id}`)}
                                        >
                                            Go to Class →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
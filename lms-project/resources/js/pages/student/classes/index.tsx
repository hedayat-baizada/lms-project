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
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                <h1 className="text-2xl font-bold">My Classes</h1>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : classes.length === 0 ? (
                    <div className="rounded-xl border p-8 text-center text-gray-500">
                        You are not enrolled in any class yet.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {classes.map(cls => (
                            <div key={cls.id} className="rounded-xl border p-5 hover:shadow-md transition">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="font-semibold text-lg">{cls.name}</h2>
                                    <span className={`text-xs px-2 py-1 rounded-full ${cls.type === 'english' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {cls.type === 'english' ? '🇬🇧 English' : '💻 Computer'}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>{cls.completed_lessons} / {cls.total_lessons} lessons</span>
                                        <span>{cls.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${cls.percentage}%` }}
                                        />
                                    </div>
                                </div>

                                <button
                                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700"
                                    onClick={() => router.visit(`/student/classes/${cls.id}`)}
                                >
                                    Go to Class →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
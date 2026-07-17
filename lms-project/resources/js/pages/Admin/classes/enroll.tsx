import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowLeft, UserPlus, X, Check, Users, Search } from 'lucide-react';

interface Props {
    classId: number;
}

interface Student {
    id: number;
    name: string;
    email: string;
}

interface ClassRoom {
    id: number;
    name: string;
    type: string;
    teacher?: { id: number; name: string };
}

export default function EnrollStudent({ classId }: Props) {
    const [classRoom, setClassRoom] = useState<ClassRoom | null>(null);
    const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
    const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Classes', href: '/admin/classes' },
        { title: classRoom?.name ?? 'Class', href: `/admin/classes/${classId}` },
        { title: 'Enroll Student', href: '#' },
    ];

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        );
    }

    function loadData() {
        // Load class details
        fetch(`/api/classes/${classId}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => {
                if (data && data.id) {
                    setClassRoom(data);
                }
            })
            .catch(() => {});

        // Load enrolled students
        fetch(`/api/classes/${classId}/students`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => {
                setEnrolledStudents(Array.isArray(data) ? data : []);
            })
            .catch(() => {});

        // Load all students (not enrolled in this class)
        fetch('/api/admin/students', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => {
                const allStudents = Array.isArray(data) ? data : [];
                const enrolledIds = enrolledStudents.map(s => s.id);
                const available = allStudents.filter(s => !enrolledIds.includes(s.id));
                setAvailableStudents(available);
                setLoading(false);
            })
            .catch(() => {
                setAvailableStudents([]);
                setLoading(false);
            });
    }

    useEffect(() => {
        loadData();
    }, [classId]);

    function handleEnrollStudent(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedStudent) {
            setMessage('Please select a student.');
            return;
        }

        setEnrolling(true);
        setMessage('');

        fetch(`/api/classes/${classId}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({
                student_id: parseInt(selectedStudent),
                teacher_id: classRoom?.teacher?.id || null,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Error occurred');
                    });
                }
                return response.json();
            })
            .then(() => {
                setMessage('✅ Student enrolled successfully!');
                setEnrolling(false);
                setSelectedStudent('');
                // Reload data
                setTimeout(() => {
                    loadData();
                    setMessage('');
                }, 1500);
            })
            .catch(error => {
                setMessage('❌ ' + error.message);
                setEnrolling(false);
            });
    }

    // Filter students based on search
    const filteredStudents = availableStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enroll Student" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">

                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white shadow-xl shadow-emerald-200/50">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="relative flex items-center gap-4">
                        <button
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
                            onClick={() => router.visit(`/admin/classes/${classId}`)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                <UserPlus className="h-7 w-7" />
                                Enroll Student
                            </h1>
                            <p className="mt-1 text-white/80 text-sm">
                                {classRoom?.name} · {classRoom?.type === 'english' ? 'English' : 'Computer'} Class
                                {classRoom?.teacher && (
                                    <span className="ml-2 text-white/60">· Instructor: {classRoom.teacher.name}</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-4">
                        <p className="text-sm text-slate-500">Currently Enrolled</p>
                        <p className="text-2xl font-bold text-slate-700">{enrolledStudents.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-4">
                        <p className="text-sm text-slate-500">Available to Enroll</p>
                        <p className="text-2xl font-bold text-slate-700">{availableStudents.length}</p>
                    </div>
                </div>

                {/* Enroll Form */}
                <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-6">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-emerald-500" />
                        Enroll a Student
                    </h2>

                    {message && (
                        <div className={`mb-4 text-sm text-center p-3 rounded-lg ${message.includes('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleEnrollStudent}>
                        <div className="space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search students by name or email..."
                                    className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Student Select */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Student *</label>
                                <select
                                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                                    value={selectedStudent}
                                    onChange={e => setSelectedStudent(e.target.value)}
                                    required
                                >
                                    <option value="">Select a student...</option>
                                    {filteredStudents.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.name} ({student.email})
                                        </option>
                                    ))}
                                </select>
                                {filteredStudents.length === 0 && availableStudents.length > 0 && (
                                    <p className="text-xs text-slate-400 mt-1">No students match your search.</p>
                                )}
                                {availableStudents.length === 0 && (
                                    <p className="text-xs text-amber-600 mt-1">All students are already enrolled in this class.</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={enrolling || !selectedStudent || availableStudents.length === 0}
                                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {enrolling ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Enrolling...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        Enroll Student
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Currently Enrolled List */}
                <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50/80 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Users className="h-4 w-4 text-emerald-500" />
                            Currently Enrolled Students
                            <span className="text-xs font-normal text-slate-400 ml-1">
                                ({enrolledStudents.length})
                            </span>
                        </h3>
                        <button
                            className="text-xs text-emerald-600 hover:text-emerald-800 font-medium hover:underline transition-all"
                            onClick={() => router.visit(`/admin/classes/${classId}`)}
                        >
                            View all →
                        </button>
                    </div>
                    <div className="p-4">
                        {enrolledStudents.length === 0 ? (
                            <div className="text-center py-6">
                                <Users className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                <p className="text-slate-500 text-sm">No students enrolled yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-2 md:grid-cols-2">
                                {enrolledStudents.map(student => (
                                    <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 hover:bg-emerald-50/50 transition-colors">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600 font-medium text-sm">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-slate-700 truncate">{student.name}</p>
                                            <p className="text-xs text-slate-400 truncate">{student.email}</p>
                                        </div>
                                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
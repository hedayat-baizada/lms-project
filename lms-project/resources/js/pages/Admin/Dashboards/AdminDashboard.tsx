import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type SharedData } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
]

interface AdminStats {
    total_students: number
    total_teachers: number
    total_classes: number
    total_lessons: number
    total_homework_submissions: number
    pending_homework: number
    total_exam_submissions: number
    pending_attendance: number
    recent_students: { id: number; name: string; email: string; created_at: string }[]
}

interface TeacherStats {
    pending_homework: number
    pending_attendance: number
    pending_exams: number
}

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props
    const user = auth.user
    const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
    const [teacherStats, setTeacherStats] = useState<TeacherStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user.role === 'admin') {
            fetch('/api/admin/stats', {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'include',
            })
                .then(r => r.json())
                .then(d => {
                    setAdminStats(d)
                    setLoading(false)
                })
                .catch(() => setLoading(false))
        } else if (user.role === 'teacher') {
            fetch('/api/teacher/stats', {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'include',
            })
                .then(r => r.json())
                .then(d => {
                    setTeacherStats(d)
                    setLoading(false)
                })
                .catch(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [user.role])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">

                {/* Welcome Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-xl shadow-indigo-200/50">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
                            <p className="mt-1 text-white/80 text-sm">
                                Role: <span className="font-semibold capitalize text-white">{user.role as string}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                        </div>
                    </div>
                </div>

                {/* Admin Dashboard */}
                {user.role === 'admin' && adminStats && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="group rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-5 hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 group-hover:scale-110 transition-transform">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Students</p>
                                        <p className="text-2xl font-bold text-slate-800">{adminStats.total_students}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="group rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-5 hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-green-100 p-3 text-green-600 group-hover:scale-110 transition-transform">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Teachers</p>
                                        <p className="text-2xl font-bold text-slate-800">{adminStats.total_teachers}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="group rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-5 hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600 group-hover:scale-110 transition-transform">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Classes</p>
                                        <p className="text-2xl font-bold text-slate-800">{adminStats.total_classes}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="group rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-5 hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600 group-hover:scale-110 transition-transform">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Lessons</p>
                                        <p className="text-2xl font-bold text-slate-800">{adminStats.total_lessons}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Actions - Admin sees global numbers */}
                        <div className="grid gap-5 sm:grid-cols-3">
                            <div className="group rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50/80 border border-yellow-200/50 p-5 shadow-md hover:shadow-lg hover:shadow-yellow-200/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-700">⏳ Pending Homework</p>
                                        <p className="text-3xl font-bold text-yellow-800 mt-1">{adminStats.pending_homework}</p>
                                    </div>
                                    <span className="rounded-full bg-yellow-200/50 px-3 py-1 text-xs font-medium text-yellow-800">Action</span>
                                </div>
                                <a href="/teacher/homework" className="mt-3 inline-block text-sm font-medium text-yellow-700 hover:underline underline-offset-2">View →</a>
                            </div>
                            <div className="group rounded-2xl bg-gradient-to-br from-red-50 to-rose-50/80 border border-red-200/50 p-5 shadow-md hover:shadow-lg hover:shadow-red-200/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-700">⏳ Pending Attendance</p>
                                        <p className="text-3xl font-bold text-red-800 mt-1">{adminStats.pending_attendance}</p>
                                    </div>
                                    <span className="rounded-full bg-red-200/50 px-3 py-1 text-xs font-medium text-red-800">Action</span>
                                </div>
                                <a href="/teacher/attendance" className="mt-3 inline-block text-sm font-medium text-red-700 hover:underline underline-offset-2">View →</a>
                            </div>
                            <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/80 border border-blue-200/50 p-5 shadow-md hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700">📋 Exam Submissions</p>
                                        <p className="text-3xl font-bold text-blue-800 mt-1">{adminStats.total_exam_submissions}</p>
                                    </div>
                                    <span className="rounded-full bg-blue-200/50 px-3 py-1 text-xs font-medium text-blue-800">Info</span>
                                </div>
                                <a href="/teacher/exams" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline underline-offset-2">View →</a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="grid gap-5 sm:grid-cols-3">
                            <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50/80 border border-blue-200/50 p-6 shadow-md hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-1 transition-all duration-300">
                                <h2 className="text-xl font-bold text-blue-700">📚 Classes</h2>
                                <p className="text-sm text-slate-600 mt-1">Manage all classes</p>
                                <a href="/admin/classes" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors">
                                    View Classes →
                                </a>
                            </div>
                            <div className="group rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/80 border border-emerald-200/50 p-6 shadow-md hover:shadow-xl hover:shadow-emerald-200/50 hover:-translate-y-1 transition-all duration-300">
                                <h2 className="text-xl font-bold text-emerald-700">👩‍🎓 Students</h2>
                                <p className="text-sm text-slate-600 mt-1">Manage all students</p>
                                <a href="/admin/students" className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline underline-offset-2 transition-colors">
                                    View Students →
                                </a>
                            </div>
                            <div className="group rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50/80 border border-purple-200/50 p-6 shadow-md hover:shadow-xl hover:shadow-purple-200/50 hover:-translate-y-1 transition-all duration-300">
                                <h2 className="text-xl font-bold text-purple-700">👨‍🏫 Teachers</h2>
                                <p className="text-sm text-slate-600 mt-1">Manage all teachers</p>
                                <a href="/admin/teachers" className="mt-4 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline underline-offset-2 transition-colors">
                                    View Teachers →
                                </a>
                            </div>
                        </div>

                        {/* Recent Students */}
                        {adminStats.recent_students.length > 0 && (
                            <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <span className="text-2xl">🆕</span> Recent Students
                                </h2>
                                <div className="divide-y divide-slate-100">
                                    {adminStats.recent_students.map(student => (
                                        <div key={student.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                            <div>
                                                <p className="font-semibold text-slate-800">{student.name}</p>
                                                <p className="text-xs text-slate-500">{student.email}</p>
                                            </div>
                                            <p className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                                {new Date(student.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Teacher Dashboard */}
                {user.role === 'teacher' && (
                    <>
                        {/* Pending Cards - Teacher specific */}
                        {!loading && teacherStats ? (
                            <div className="grid gap-5 sm:grid-cols-3">
                                <div className="group rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50/80 border border-yellow-200/50 p-5 shadow-md hover:shadow-lg hover:shadow-yellow-200/50 hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-yellow-700">⏳ Pending Homework</p>
                                            <p className="text-3xl font-bold text-yellow-800 mt-1">{teacherStats.pending_homework}</p>
                                        </div>
                                        <span className="rounded-full bg-yellow-200/50 px-3 py-1 text-xs font-medium text-yellow-800">Action</span>
                                    </div>
                                    <a href="/teacher/homework" className="mt-3 inline-block text-sm font-medium text-yellow-700 hover:underline underline-offset-2">View →</a>
                                </div>
                                <div className="group rounded-2xl bg-gradient-to-br from-red-50 to-rose-50/80 border border-red-200/50 p-5 shadow-md hover:shadow-lg hover:shadow-red-200/50 hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-red-700">⏳ Pending Attendance</p>
                                            <p className="text-3xl font-bold text-red-800 mt-1">{teacherStats.pending_attendance}</p>
                                        </div>
                                        <span className="rounded-full bg-red-200/50 px-3 py-1 text-xs font-medium text-red-800">Action</span>
                                    </div>
                                    <a href="/teacher/attendance" className="mt-3 inline-block text-sm font-medium text-red-700 hover:underline underline-offset-2">View →</a>
                                </div>
                                <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/80 border border-blue-200/50 p-5 shadow-md hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-700">📋 Exam Submissions</p>
                                            <p className="text-3xl font-bold text-blue-800 mt-1">{teacherStats.pending_exams}</p>
                                        </div>
                                        <span className="rounded-full bg-blue-200/50 px-3 py-1 text-xs font-medium text-blue-800">Info</span>
                                    </div>
                                    <a href="/teacher/exams" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline underline-offset-2">View →</a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center py-8">
                                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Quick Links */}
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50/80 border border-blue-200/50 p-6 shadow-md hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-1 transition-all duration-300">
                                <h2 className="text-xl font-bold text-blue-700">📖 My Classes</h2>
                                <p className="text-sm text-slate-600 mt-1">View your classes</p>
                                <a href="/teacher/classes" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors">
                                    View →
                                </a>
                            </div>
                            <div className="group rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/80 border border-emerald-200/50 p-6 shadow-md hover:shadow-xl hover:shadow-emerald-200/50 hover:-translate-y-1 transition-all duration-300">
                                <h2 className="text-xl font-bold text-emerald-700">📝 Homework</h2>
                                <p className="text-sm text-slate-600 mt-1">Check student homework</p>
                                <a href="/teacher/homework" className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline underline-offset-2 transition-colors">
                                    View →
                                </a>
                            </div>
                            <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50/80 border border-amber-200/50 p-6 shadow-md hover:shadow-xl hover:shadow-amber-200/50 hover:-translate-y-1 transition-all duration-300">
                                <h2 className="text-xl font-bold text-amber-700">✅ Attendance</h2>
                                <p className="text-sm text-slate-600 mt-1">Approve student attendance</p>
                                <a href="/teacher/attendance" className="mt-4 inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 hover:underline underline-offset-2 transition-colors">
                                    View →
                                </a>
                            </div>
                            <div className="group rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50/80 border border-purple-200/50 p-6 shadow-md hover:shadow-xl hover:shadow-purple-200/50 hover:-translate-y-1 transition-all duration-300">
                                <h2 className="text-xl font-bold text-purple-700">📋 Exams</h2>
                                <p className="text-sm text-slate-600 mt-1">Grade final exam submissions</p>
                                <a href="/teacher/exams" className="mt-4 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline underline-offset-2 transition-colors">
                                    View →
                                </a>
                            </div>
                        </div>
                    </>
                )}

                {/* Student Dashboard */}
                {user.role === 'student' && (
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50/80 border border-blue-200/50 p-6 shadow-md hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-1 transition-all duration-300">
                            <h2 className="text-xl font-bold text-blue-700">📚 My Classes</h2>
                            <p className="text-sm text-slate-600 mt-1">View your enrolled classes</p>
                            <a href="/student/classes" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors">
                                View →
                            </a>
                        </div>
                        <div className="group rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/80 border border-emerald-200/50 p-6 shadow-md hover:shadow-xl hover:shadow-emerald-200/50 hover:-translate-y-1 transition-all duration-300">
                            <h2 className="text-xl font-bold text-emerald-700">📊 My Results</h2>
                            <p className="text-sm text-slate-600 mt-1">View your scores and feedback</p>
                            <a href="/student/results" className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline underline-offset-2 transition-colors">
                                View →
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    )
}
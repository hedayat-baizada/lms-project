import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type SharedData } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
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

    const roles: string[] = (user?.roles as string[]) ?? []
    const isAdmin = roles.includes('Admin') || roles.includes('Super Admin')
    const isTeacher = roles.includes('Teacher')
    const isStudent = roles.includes('Student') || (!isAdmin && !isTeacher && roles.length === 0)

    const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
    const [teacherStats, setTeacherStats] = useState<TeacherStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isAdmin) {
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
        } else if (isTeacher) {
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
    }, [isAdmin, isTeacher])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Welcome Card */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-xl shadow-indigo-200/50"
                    >
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
                                <p className="mt-1 text-white/80 text-sm">
                                    Role: <span className="font-semibold capitalize text-white">{roles.join(', ') || 'Student'}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                Online
                            </div>
                        </div>
                    </motion.div>

                    {/* Admin Dashboard */}
                    {isAdmin && adminStats && (
                        <>
                            {/* Stats Cards */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ staggerChildren: 0.1 }}
                                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                            >
                                {[
                                    { label: 'Students', value: adminStats.total_students, color: 'blue', icon: '👩‍🎓' },
                                    { label: 'Teachers', value: adminStats.total_teachers, color: 'green', icon: '👨‍🏫' },
                                    { label: 'Classes', value: adminStats.total_classes, color: 'purple', icon: '📚' },
                                    { label: 'Lessons', value: adminStats.total_lessons, color: 'orange', icon: '📖' },
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200/60 p-6 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-100 flex items-center justify-center text-2xl shadow-sm`}>
                                                {stat.icon}
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Pending Actions - links fixed to teacher routes */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="grid gap-5 sm:grid-cols-3"
                            >
                                <div className="bg-gradient-to-br from-yellow-50 to-amber-50/80 backdrop-blur-sm rounded-2xl border border-yellow-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-yellow-700">⏳ Pending Homework</p>
                                            <p className="text-3xl font-bold text-yellow-800 mt-1">{adminStats.pending_homework}</p>
                                        </div>
                                        <span className="rounded-full bg-yellow-200/50 px-3 py-1 text-xs font-medium text-yellow-800">Action</span>
                                    </div>
                                    <a
                                        href="/teacher/homework"
                                        className="mt-3 inline-block text-sm font-medium text-yellow-700 hover:underline underline-offset-2"
                                    >
                                        View →
                                    </a>
                                </div>
                                <div className="bg-gradient-to-br from-red-50 to-rose-50/80 backdrop-blur-sm rounded-2xl border border-red-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-red-700">⏳ Pending Attendance</p>
                                            <p className="text-3xl font-bold text-red-800 mt-1">{adminStats.pending_attendance}</p>
                                        </div>
                                        <span className="rounded-full bg-red-200/50 px-3 py-1 text-xs font-medium text-red-800">Action</span>
                                    </div>
                                    <a
                                        href="/teacher/attendance"
                                        className="mt-3 inline-block text-sm font-medium text-red-700 hover:underline underline-offset-2"
                                    >
                                        View →
                                    </a>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-700">📋 Exam Submissions</p>
                                            <p className="text-3xl font-bold text-blue-800 mt-1">{adminStats.total_exam_submissions}</p>
                                        </div>
                                        <span className="rounded-full bg-blue-200/50 px-3 py-1 text-xs font-medium text-blue-800">Info</span>
                                    </div>
                                    <a
                                        href="/teacher/exams"
                                        className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline underline-offset-2"
                                    >
                                        View →
                                    </a>
                                </div>
                            </motion.div>

                            {/* Quick Links */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid gap-5 sm:grid-cols-3"
                            >
                                <div className="bg-gradient-to-br from-blue-50 to-sky-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <h2 className="text-xl font-bold text-blue-700">📚 Classes</h2>
                                    <p className="text-sm text-slate-600 mt-1">Manage all classes</p>
                                    <a href="/admin/classes" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline underline-offset-2">
                                        View Classes →
                                    </a>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <h2 className="text-xl font-bold text-emerald-700">👩‍🎓 Students</h2>
                                    <p className="text-sm text-slate-600 mt-1">Manage all students</p>
                                    <a href="/admin/students" className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline underline-offset-2">
                                        View Students →
                                    </a>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-violet-50/80 backdrop-blur-sm rounded-2xl border border-purple-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <h2 className="text-xl font-bold text-purple-700">👨‍🏫 Teachers</h2>
                                    <p className="text-sm text-slate-600 mt-1">Manage all teachers</p>
                                    <a href="/admin/teachers" className="mt-4 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline underline-offset-2">
                                        View Teachers →
                                    </a>
                                </div>
                            </motion.div>

                            {/* Recent Students */}
                            {adminStats.recent_students.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6"
                                >
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                                        <span className="text-2xl">🆕</span> Recent Students
                                    </h2>
                                    <div className="divide-y divide-slate-100">
                                        {adminStats.recent_students.map((student) => (
                                            <div key={student.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-xs font-bold flex items-center justify-center">
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{student.name}</p>
                                                        <p className="text-xs text-slate-500">{student.email}</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                                    {new Date(student.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}

                    {/* Teacher Dashboard */}
                    {isTeacher && (
                        <>
                            {!loading && teacherStats ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid gap-5 sm:grid-cols-3"
                                >
                                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50/80 backdrop-blur-sm rounded-2xl border border-yellow-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-yellow-700">⏳ Pending Homework</p>
                                                <p className="text-3xl font-bold text-yellow-800 mt-1">{teacherStats.pending_homework}</p>
                                            </div>
                                            <span className="rounded-full bg-yellow-200/50 px-3 py-1 text-xs font-medium text-yellow-800">Action</span>
                                        </div>
                                        <a href="/teacher/homework" className="mt-3 inline-block text-sm font-medium text-yellow-700 hover:underline underline-offset-2">View →</a>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-50 to-rose-50/80 backdrop-blur-sm rounded-2xl border border-red-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-red-700">⏳ Pending Attendance</p>
                                                <p className="text-3xl font-bold text-red-800 mt-1">{teacherStats.pending_attendance}</p>
                                            </div>
                                            <span className="rounded-full bg-red-200/50 px-3 py-1 text-xs font-medium text-red-800">Action</span>
                                        </div>
                                        <a href="/teacher/attendance" className="mt-3 inline-block text-sm font-medium text-red-700 hover:underline underline-offset-2">View →</a>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-700">📋 Exam Submissions</p>
                                                <p className="text-3xl font-bold text-blue-800 mt-1">{teacherStats.pending_exams}</p>
                                            </div>
                                            <span className="rounded-full bg-blue-200/50 px-3 py-1 text-xs font-medium text-blue-800">Info</span>
                                        </div>
                                        <a href="/teacher/exams" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline underline-offset-2">View →</a>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex justify-center items-center py-8">
                                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                </div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                            >
                                {[
                                    { label: 'My Classes', icon: '📖', color: 'blue', href: '/teacher/classes' },
                                    { label: 'Homework', icon: '📝', color: 'emerald', href: '/teacher/homework' },
                                    { label: 'Attendance', icon: '✅', color: 'amber', href: '/teacher/attendance' },
                                    { label: 'Exams', icon: '📋', color: 'purple', href: '/teacher/exams' },
                                ].map((item) => (
                                    <div key={item.label} className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-50/80 backdrop-blur-sm rounded-2xl border border-${item.color}-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                                        <h2 className={`text-xl font-bold text-${item.color}-700`}>{item.icon} {item.label}</h2>
                                        <p className="text-sm text-slate-600 mt-1">View your {item.label.toLowerCase()}</p>
                                        <a href={item.href} className={`mt-4 inline-flex items-center text-sm font-medium text-${item.color}-600 hover:text-${item.color}-800 hover:underline underline-offset-2`}>
                                            View →
                                        </a>
                                    </div>
                                ))}
                            </motion.div>
                        </>
                    )}

                    {/* Student Dashboard */}
                    {isStudent && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid gap-5 sm:grid-cols-2"
                        >
                            <div className="bg-gradient-to-br from-blue-50 to-sky-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <h2 className="text-xl font-bold text-blue-700">📚 My Classes</h2>
                                <p className="text-sm text-slate-600 mt-1">View your enrolled classes</p>
                                <a href="/student/classes" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline underline-offset-2">
                                    View →
                                </a>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <h2 className="text-xl font-bold text-emerald-700">📊 My Results</h2>
                                <p className="text-sm text-slate-600 mt-1">View your scores and feedback</p>
                                <a href="/student/results" className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline underline-offset-2">
                                    View →
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Users, Mail, ChevronLeft, BookOpen, AlertCircle, User, Calendar } from 'lucide-react'

interface Student {
    id: number
    name: string
    email: string
    pivot?: {
        status: string
        start_date: string | null
        end_date: string | null
    }
}

interface ClassRoom {
    id: number
    name: string
    type: string
    level: string | null
    is_active: boolean
    teacher_id: number
    teacher?: { id: number; name: string }
}

interface Props {
    classId: number
}

export default function TeacherClassShow({ classId }: Props) {
    const [classRoom, setClassRoom] = useState<ClassRoom | null>(null)
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Classes', href: '/teacher/classes' },
        { title: classRoom?.name ?? 'Class', href: '#' },
    ]

    useEffect(() => {
        // دریافت اطلاعات کلاس
        fetch(`/api/classes/${classId}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then((r) => r.json())
            .then((d) => {
                if (d && d.id) setClassRoom(d)
            })
            .catch(() => {})

        // دریافت لیست دانشجویان
        fetch(`/api/classes/${classId}/students`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then((r) => {
                if (!r.ok) throw new Error('Failed to load students')
                return r.json()
            })
            .then((data: Student[]) => {
                console.log('Students data:', data) // برای دیباگ
                setStudents(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error loading students:', err)
                setError('Could not load students. Please try again.')
                setLoading(false)
            })
    }, [classId])

    const getInitial = (name: string) => name.charAt(0).toUpperCase() || '?'

    if (!classId) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="p-6 text-center text-red-500">Invalid class ID</div>
            </AppLayout>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={classRoom?.name ?? 'Class Students'} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">

                {/* ===== Back button & Header ===== */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="rounded-full p-2 hover:bg-white/50 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <BookOpen className="h-7 w-7 text-indigo-500" />
                            {classRoom?.name || 'Loading...'}
                        </h1>
                        <p className="text-sm text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                            <span>{classRoom?.type === 'english' ? 'English' : 'Computer'} Class</span>
                            {classRoom?.level && (
                                <span className="text-slate-400">· Level: {classRoom.level.replace('_', '-')}</span>
                            )}
                            {classRoom?.teacher && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    <User className="h-3 w-3" />
                                    {classRoom.teacher.name}
                                </span>
                            )}
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    classRoom?.is_active
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-rose-100 text-rose-700'
                                }`}
                            >
                                {classRoom?.is_active ? '✅ Active' : '❌ Inactive'}
                            </span>
                        </p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-slate-600 shadow-sm border border-white/50">
                        <Users className="h-4 w-4 inline mr-2" />
                        {loading ? '...' : `${students.length} Student${students.length !== 1 ? 's' : ''}`}
                    </div>
                </div>

                {/* ===== Loading ===== */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                )}

                {/* ===== Error ===== */}
                {!loading && error && (
                    <div className="rounded-2xl bg-rose-50/80 backdrop-blur-sm border border-rose-200/50 p-6 text-center">
                        <AlertCircle className="h-12 w-12 mx-auto text-rose-400 mb-3" />
                        <p className="text-rose-700 font-medium">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-200 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ===== Empty State ===== */}
                {!loading && !error && students.length === 0 && (
                    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-12 text-center">
                        <Users className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">No students enrolled yet.</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Students will appear here once they enroll in this class.
                        </p>
                    </div>
                )}

                {/* ===== Students Table ===== */}
                {!loading && !error && students.length > 0 && (
                    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50/80 text-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">#</th>
                                        <th className="px-6 py-4 text-left font-semibold">Student</th>
                                        <th className="px-6 py-4 text-left font-semibold">Email</th>
                                        <th className="px-6 py-4 text-left font-semibold">Status</th>
                                        <th className="px-6 py-4 text-left font-semibold">Enrolled</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((student, index) => {
                                        const status = student.pivot?.status || 'active'
                                        const startDate = student.pivot?.start_date
                                            ? new Date(student.pivot.start_date).toLocaleDateString()
                                            : '—'

                                        return (
                                            <tr
                                                key={student.id}
                                                className="hover:bg-indigo-50/50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-white font-semibold text-xs">
                                                        {getInitial(student.name)}
                                                    </div>
                                                    <span className="font-medium text-slate-800">
                                                        {student.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {student.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            status === 'active'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : status === 'completed'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-rose-100 text-rose-700'
                                                        }`}
                                                    >
                                                        {status === 'active' && '🟢 Active'}
                                                        {status === 'completed' && '✅ Completed'}
                                                        {status === 'dropped' && '❌ Dropped'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-xs">
                                                    {startDate}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
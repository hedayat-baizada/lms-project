import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Exams', href: '/teacher/exams' },
]

interface Submission {
    id: number
    answer: string
    score: number | null
    teacher_feedback: string | null
    status: string
    student: { id: number; name: string; email: string }
    question: { id: number; question: string }
}

interface ClassRoom {
    id: number
    name: string
    type: string
}

export default function TeacherExams() {
    const [classes, setClasses] = useState<ClassRoom[]>([])
    const [selectedClass, setSelectedClass] = useState('')
    const [submissions, setSubmissions] = useState<{ [studentId: string]: Submission[] }>({})
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
    const [score, setScore] = useState('')
    const [feedback, setFeedback] = useState('')
    const [message, setMessage] = useState('')

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        )
    }

    // ✅ استفاده از API اصلی که برای معلم فیلتر شده
    useEffect(() => {
        fetch('/api/classes', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then((data: ClassRoom[]) => {
                setClasses(Array.isArray(data) ? data : [])
            })
            .catch(() => setClasses([]))
    }, [])

    // بارگذاری ارسال‌های امتحان برای کلاس انتخاب‌شده
    useEffect(() => {
        if (!selectedClass) {
            setSubmissions({})
            return
        }
        setLoading(true)
        fetch('/api/classes/' + selectedClass + '/exam/submissions', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => {
                setSubmissions(typeof data === 'object' ? data : {})
                setLoading(false)
            })
            .catch(() => {
                setSubmissions({})
                setLoading(false)
            })
    }, [selectedClass])

    function handleReview(submission: Submission) {
        setSelectedSubmission(submission)
        setScore(submission.score?.toString() ?? '')
        setFeedback(submission.teacher_feedback ?? '')
        setMessage('')
        setShowModal(true)
    }

    function confirmReview() {
        if (!selectedSubmission || !score) {
            setMessage('Please enter a score.')
            return
        }

        fetch('/api/exam/submissions/' + selectedSubmission.id + '/review', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({ score: parseInt(score), teacher_feedback: feedback }),
        })
            .then(r => r.json())
            .then(d => {
                if (d.message === 'Submission reviewed successfully') {
                    setMessage('✅ Reviewed!')
                    // بارگذاری مجدد
                    fetch('/api/classes/' + selectedClass + '/exam/submissions', {
                        headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                        credentials: 'include',
                    })
                        .then(r => r.json())
                        .then(data => setSubmissions(typeof data === 'object' ? data : {}))
                    setTimeout(() => {
                        setShowModal(false)
                        setMessage('')
                    }, 1500)
                } else {
                    setMessage('❌ ' + (d.message ?? 'Error'))
                }
            })
    }

    const studentIds = Object.keys(submissions)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exams" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">

                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-xl shadow-indigo-200/50">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="relative">
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            📝 Final Exam Submissions
                        </h1>
                        <p className="mt-1 text-white/80 text-sm">
                            Review and grade student exam answers for your classes
                        </p>
                    </div>
                </div>

                {/* Class Selector */}
                <div className="max-w-xs">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Class</label>
                    <select
                        className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                    >
                        <option value="">— Select Class —</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                )}

                {!loading && selectedClass && studentIds.length === 0 && (
                    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-12 text-center">
                        <p className="text-slate-500 font-medium">No exam submissions yet.</p>
                        <p className="text-sm text-slate-400 mt-1">Students haven't submitted the final exam for this class.</p>
                    </div>
                )}

                {!loading && studentIds.length > 0 && (
                    <div className="space-y-6">
                        {studentIds.map(studentId => {
                            const studentSubs = submissions[parseInt(studentId)]
                            const student = studentSubs[0]?.student
                            const allReviewed = studentSubs.every(s => s.status === 'reviewed')
                            const totalScore = studentSubs.reduce((sum, s) => sum + (s.score ?? 0), 0)

                            return (
                                <div key={studentId} className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-6 hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-800">{student?.name}</h2>
                                            <p className="text-sm text-slate-500">{student?.email}</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${allReviewed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {allReviewed ? '✅ Fully Reviewed' : '⏳ Pending Review'}
                                            </span>
                                            {allReviewed && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-medium">
                                                    🏆 Total: {totalScore} pts
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {studentSubs.map((sub, index) => (
                                            <div key={sub.id} className="rounded-xl bg-slate-50/80 p-4 border border-slate-100/50">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-slate-700 mb-1">
                                                            Q{index + 1}: {sub.question?.question}
                                                        </p>
                                                        <div className="bg-white rounded-lg p-3 border border-slate-200/50">
                                                            <p className="text-sm text-slate-600">{sub.answer}</p>
                                                        </div>
                                                        {sub.teacher_feedback && (
                                                            <p className="text-xs text-indigo-600 mt-2">
                                                                💬 Feedback: {sub.teacher_feedback}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 min-w-fit">
                                                        {sub.score !== null && (
                                                            <span className="text-sm font-bold text-emerald-600">
                                                                {sub.score} pts
                                                            </span>
                                                        )}
                                                        <button
                                                            className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${sub.status === 'reviewed' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                                                            onClick={() => handleReview(sub)}
                                                        >
                                                            {sub.status === 'reviewed' ? '✏️ Edit' : '📝 Grade'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Grade Modal */}
                {showModal && selectedSubmission && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative">
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl"></div>
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-purple-300/20 blur-2xl"></div>
                            <div className="relative">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 mb-1">
                                    📝 Grade Answer
                                </h2>
                                <p className="text-sm text-slate-500 mb-4">
                                    Student: <span className="font-medium text-slate-700">{selectedSubmission.student?.name}</span>
                                </p>
                                <div className="rounded-xl bg-slate-50/80 p-4 mb-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-600">Question:</p>
                                    <p className="text-sm text-slate-700 mt-1">{selectedSubmission.question?.question}</p>
                                    <p className="text-xs font-semibold text-slate-600 mt-3">Answer:</p>
                                    <p className="text-sm text-slate-600 bg-white rounded-lg p-2 border border-slate-200/50 mt-1">{selectedSubmission.answer}</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Score (0-100) *</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            value={score}
                                            onChange={e => setScore(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Feedback</label>
                                        <textarea
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            rows={3}
                                            placeholder="Write feedback for the student..."
                                            value={feedback}
                                            onChange={e => setFeedback(e.target.value)}
                                        />
                                    </div>
                                    {message && (
                                        <div className={`text-sm text-center p-2 rounded-lg ${message.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                            {message}
                                        </div>
                                    )}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] transition-all"
                                            onClick={confirmReview}
                                        >
                                            Save Grade
                                        </button>
                                        <button
                                            className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
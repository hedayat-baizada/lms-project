import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homework', href: '/teacher/homework' },
]

interface Submission {
    id: number
    answer: string
    score: number | null
    teacher_feedback: string | null
    status: string
    created_at: string
    student: { id: number; name: string; email: string }
    homework: { 
        id: number
        title: string
        question: string
        lesson: {
            id: number
            title: string
            class_room: {
                id: number
                name: string
            }
        }
    }
}

export default function TeacherHomework() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<Submission | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [score, setScore] = useState('')
    const [feedback, setFeedback] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState<string | null>(null)

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        )
    }

    function loadData() {
        setLoading(true)
        setError(null)
        fetch('/api/teacher/homework/pending', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch pending homework')
                return r.json()
            })
            .then(data => {
                console.log('📥 Pending homework data:', data) // دیباگ
                setSubmissions(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(err => {
                console.error('❌ Error loading pending homework:', err)
                setError('Could not load pending homework. Please try again.')
                setSubmissions([])
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData()
    }, [])

    function handleReview() {
        if (!selected || !score) {
            setMessage('Please enter a score.')
            return
        }

        fetch('/api/homework/submissions/' + selected.id + '/review', {
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
                if (d.message === 'Homework reviewed successfully') {
                    setMessage('✅ Reviewed!')
                    loadData()
                    setTimeout(() => {
                        setShowModal(false)
                        setMessage('')
                    }, 1500)
                } else {
                    setMessage('❌ ' + (d.message ?? 'Error'))
                }
            })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Homework" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-xl shadow-indigo-200/50">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="relative">
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            📝 Pending Homework
                        </h1>
                        <p className="mt-1 text-white/80 text-sm">
                            Review and grade homework submissions from your students
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl bg-rose-50/80 backdrop-blur-sm border border-rose-200/50 p-6 text-center">
                        <p className="text-rose-700 font-medium">{error}</p>
                        <button
                            onClick={loadData}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-200 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && submissions.length === 0 && (
                    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-12 text-center">
                        <div className="text-4xl mb-4">✅</div>
                        <p className="text-slate-500 font-medium text-lg">All homework reviewed!</p>
                        <p className="text-sm text-slate-400 mt-1">No pending homework submissions to review.</p>
                    </div>
                )}

                {!loading && !error && submissions.length > 0 && (
                    <div className="space-y-4">
                        {submissions.map((sub) => (
                            <div key={sub.id} className="group rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-5 hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-700 px-2.5 py-0.5 text-xs font-medium">
                                                📚 {sub.homework?.lesson?.class_room?.name || 'Unknown Class'}
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-700 px-2.5 py-0.5 text-xs font-medium">
                                                📖 {sub.homework?.lesson?.title || 'Unknown Lesson'}
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2.5 py-0.5 text-xs font-medium">
                                                ⏳ Pending
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800 mt-2">
                                            {sub.homework?.title || 'Homework'}
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-1">
                                            <span className="font-medium">Student:</span> {sub.student?.name}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                            {sub.answer}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Submitted: {new Date(sub.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 min-w-fit">
                                        <button
                                            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 hover:scale-105 transition-all"
                                            onClick={() => {
                                                setSelected(sub)
                                                setScore(sub.score?.toString() ?? '')
                                                setFeedback(sub.teacher_feedback ?? '')
                                                setMessage('')
                                                setShowModal(true)
                                            }}
                                        >
                                            📝 Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && selected && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative max-h-[90vh] overflow-y-auto">
                            <div className="relative">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 mb-2">
                                    📝 Review Homework
                                </h2>
                                <div className="text-sm text-slate-500 mb-4 space-y-1">
                                    <p><span className="font-medium text-slate-700">Student:</span> {selected.student?.name}</p>
                                    <p><span className="font-medium text-slate-700">Class:</span> {selected.homework?.lesson?.class_room?.name}</p>
                                    <p><span className="font-medium text-slate-700">Lesson:</span> {selected.homework?.lesson?.title}</p>
                                </div>
                                <div className="rounded-xl bg-slate-50/80 p-4 mb-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-700">Question:</p>
                                    <p className="text-sm text-slate-600 mt-1">{selected.homework?.question}</p>
                                    <p className="text-xs font-semibold text-slate-700 mt-3">Answer:</p>
                                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{selected.answer}</p>
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
                                            onClick={handleReview}
                                        >
                                            Submit Review
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
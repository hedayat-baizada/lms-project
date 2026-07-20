import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Question {
    id: number
    question: string
    order: number
}

interface Exam {
    id: number
    title: string
    description: string | null
    total_score: number
    questions: Question[]
}

interface Props {
    classId: number
}

export default function StudentExam({ classId }: Props) {
    const [className, setClassName] = useState('')
    const [exam, setExam] = useState<Exam | null>(null)
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState<{ [key: number]: string }>({})
    const [submitted, setSubmitted] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Classes', href: '/student/classes' },
        { title: className, href: '/student/classes/' + classId },
        { title: 'Final Exam', href: '#' },
    ]

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        )
    }

    useEffect(() => {
        fetch('/api/classes/' + classId, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(d => {
                if (d?.name) setClassName(d.name)
            })
            .catch(() => {})

        fetch('/api/classes/' + classId + '/exam', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(d => {
                if (d?.id) setExam(d)
                else setError(d.message ?? 'No exam found')
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [classId])

    const answeredCount = exam ? exam.questions.filter(q => answers[q.id]?.trim()).length : 0
    const totalQuestions = exam?.questions?.length || 0
    const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

    function handleSubmit() {
        if (!exam) return

        const unanswered = exam.questions.filter(q => !answers[q.id]?.trim())
        if (unanswered.length > 0) {
            setMessage('⚠️ Please answer all questions before submitting.')
            return
        }

        const answersArray = exam.questions.map(q => ({
            question_id: q.id,
            answer: answers[q.id],
        }))

        fetch('/api/classes/' + classId + '/exam/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({ answers: answersArray }),
        })
            .then(r => r.json())
            .then(d => {
                if (d.message === 'Exam submitted successfully') {
                    setSubmitted(true)
                    setMessage('🎉 Exam submitted successfully! Your teacher will review it soon.')
                } else {
                    setMessage('❌ ' + (d.message ?? 'Error occurred'))
                }
            })
            .catch(() => setMessage('❌ An error occurred. Please try again.'))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Final Exam" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-6">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            📝 Final Exam
                        </h1>
                        <span className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-slate-500 shadow-sm border border-slate-200/60">
                            {className}
                        </span>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-16">
                            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    )}

                    {!loading && error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-12 text-center shadow-sm"
                        >
                            <div className="text-6xl mb-4">{error === 'You must complete all lessons first' ? '🔒' : '📭'}</div>
                            <p className="text-slate-500 text-lg">
                                {error === 'You must complete all lessons first'
                                    ? '🔒 You must complete all lessons before taking the final exam.'
                                    : error}
                            </p>
                        </motion.div>
                    )}

                    {submitted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-50/80 backdrop-blur-sm rounded-2xl border border-emerald-200 p-10 text-center shadow-md"
                        >
                            <div className="text-6xl mb-4">🎉</div>
                            <p className="text-emerald-700 font-semibold text-xl">Exam submitted successfully!</p>
                            <p className="text-slate-500 text-sm mt-2">
                                Your teacher will review and grade it soon. You can close this page.
                            </p>
                        </motion.div>
                    )}

                    {!loading && !error && exam && !submitted && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Exam Info Card */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-6">
                                <h2 className="text-2xl font-bold text-slate-800">{exam.title}</h2>
                                {exam.description && (
                                    <p className="text-slate-500 mt-1">{exam.description}</p>
                                )}
                                <div className="flex items-center gap-6 mt-3 text-sm">
                                    <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                                        📊 {exam.total_score} points
                                    </span>
                                    <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                                        ❓ {totalQuestions} questions
                                    </span>
                                    <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                                        ✅ {answeredCount} answered
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200/60 p-4">
                                <div className="flex justify-between text-sm text-slate-500 mb-1">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="h-2.5 rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-purple-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Questions */}
                            <div className="space-y-4">
                                {exam.questions.map((q, index) => {
                                    const isAnswered = answers[q.id]?.trim()
                                    return (
                                        <motion.div
                                            key={q.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border transition-all ${
                                                isAnswered
                                                    ? 'border-emerald-200 shadow-emerald-100/50'
                                                    : 'border-slate-200/60 hover:border-indigo-200'
                                            } p-6`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                                                    {index + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-slate-800 font-medium">{q.question}</p>
                                                    <textarea
                                                        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-y"
                                                        rows={4}
                                                        placeholder="Write your answer here..."
                                                        value={answers[q.id] ?? ''}
                                                        onChange={e =>
                                                            setAnswers({ ...answers, [q.id]: e.target.value })
                                                        }
                                                    />
                                                    {isAnswered && (
                                                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                                            ✅ Answered
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {message && (
                                <div
                                    className={`text-center p-4 rounded-xl ${
                                        message.includes('successfully')
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : message.includes('⚠️')
                                            ? 'bg-amber-50 text-amber-700'
                                            : 'bg-rose-50 text-rose-700'
                                    }`}
                                >
                                    {message}
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                                onClick={handleSubmit}
                            >
                                📤 Submit Exam
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
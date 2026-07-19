import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Results', href: '/student/results' },
]

// ---------- Interfaces ----------
interface ClassResult {
    class_id: number
    class_name: string
    teacher: string
    final_percentage: number
    grade: string
    status: string
    eligible_for: string
}

interface HomeworkSubmission {
    id: number
    answer: string
    score: number | null
    teacher_feedback: string | null
    status: string
    homework: {
        title: string
        question: string
        lesson: {
            title: string
            class_room: { name: string }
        }
    }
}

interface ExamSubmission {
    id: number
    answer: string
    score: number | null
    teacher_feedback: string | null
    status: string
    question: { question: string }
    final_exam: {
        title: string
        class_room: { name: string }
    }
}

export default function StudentResults() {
    const [classResults, setClassResults] = useState<ClassResult[]>([])
    const [homeworkSubs, setHomeworkSubs] = useState<HomeworkSubmission[]>([])
    const [examSubs, setExamSubs] = useState<ExamSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('homework')

    useEffect(() => {
        fetch('/api/student/classes-with-results', {
            headers: { 'Accept': 'application/json' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => setClassResults(data))
            .catch(() => {})

        fetch('/api/student/results', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(d => {
                setHomeworkSubs(Array.isArray(d.homework) ? d.homework : [])
                setExamSubs(Array.isArray(d.exams) ? d.exams : [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const homeworkAvg = homeworkSubs.filter(s => s.score !== null).length > 0
        ? Math.round(homeworkSubs.filter(s => s.score !== null).reduce((sum, s) => sum + (s.score ?? 0), 0) / homeworkSubs.filter(s => s.score !== null).length)
        : null

    const examAvg = examSubs.filter(s => s.score !== null).length > 0
        ? Math.round(examSubs.filter(s => s.score !== null).reduce((sum, s) => sum + (s.score ?? 0), 0) / examSubs.filter(s => s.score !== null).length)
        : null

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A+':
            case 'A':
                return 'text-emerald-500'
            case 'B':
                return 'text-blue-500'
            case 'C':
                return 'text-amber-500'
            default:
                return 'text-rose-500'
        }
    }

    const getGradeBg = (grade: string) => {
        switch (grade) {
            case 'A+':
            case 'A':
                return 'bg-emerald-50 border-emerald-200'
            case 'B':
                return 'bg-blue-50 border-blue-200'
            case 'C':
                return 'bg-amber-50 border-amber-200'
            default:
                return 'bg-rose-50 border-rose-200'
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Results" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-6">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            📊 My Results
                        </h1>
                        <span className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-slate-500 shadow-sm border border-slate-200/60">
                            {loading ? 'Loading...' : `${classResults.length} class(es)`}
                        </span>
                    </div>

                    {/* Class Report Cards */}
                    {!loading && classResults.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full inline-block" />
                                Class Report Cards
                            </h2>
                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {classResults.map((item, idx) => (
                                    <motion.div
                                        key={item.class_id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl border border-slate-200/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-800">{item.class_name}</h3>
                                                    <p className="text-sm text-slate-500 mt-0.5">👨‍🏫 {item.teacher}</p>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                    item.status === 'Passed'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                    {item.status === 'Passed' ? '✅ Pass' : '❌ Fail'}
                                                </span>
                                            </div>

                                            <div className="mt-4 grid grid-cols-3 gap-2">
                                                <div className="bg-slate-50 rounded-xl py-2 text-center">
                                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Marks</p>
                                                    <p className="text-xl font-bold text-slate-800">{item.final_percentage}%</p>
                                                </div>
                                                <div className={`bg-slate-50 rounded-xl py-2 text-center border-2 ${getGradeBg(item.grade)}`}>
                                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Grade</p>
                                                    <p className={`text-xl font-bold ${getGradeColor(item.grade)}`}>{item.grade}</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl py-2 text-center">
                                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Eligible</p>
                                                    <p className="text-xs font-medium text-slate-700 truncate" title={item.eligible_for}>
                                                        {item.eligible_for}
                                                    </p>
                                                </div>
                                            </div>

                                            <a
                                                href={`/student/classes/${item.class_id}/result`}
                                                className="mt-5 inline-block w-full text-center py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                                            >
                                                📄 View Full Report Card
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {!loading && classResults.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-slate-500 text-lg">You are not enrolled in any classes yet.</p>
                            <p className="text-slate-400 text-sm mt-1">Your results will appear here once you join a class.</p>
                        </motion.div>
                    )}

                    {/* Stats Cards */}
                    {!loading && (
                        <div className="grid gap-5 md:grid-cols-3">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 flex items-center gap-4 hover:shadow-xl transition-shadow">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl shadow-md">
                                    📝
                                </div>
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">Homework Submitted</p>
                                    <p className="text-3xl font-bold text-slate-800">{homeworkSubs.length}</p>
                                </div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 flex items-center gap-4 hover:shadow-xl transition-shadow">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl shadow-md">
                                    📊
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-600 font-medium">Homework Avg Score</p>
                                    <p className="text-3xl font-bold text-slate-800">
                                        {homeworkAvg !== null ? homeworkAvg + '%' : '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 flex items-center gap-4 hover:shadow-xl transition-shadow">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-2xl shadow-md">
                                    📋
                                </div>
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">Exam Avg Score</p>
                                    <p className="text-3xl font-bold text-slate-800">
                                        {examAvg !== null ? examAvg + '%' : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex items-center gap-1 border-b border-slate-200 pb-1">
                        <button
                            className={`px-6 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                                activeTab === 'homework'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            onClick={() => setActiveTab('homework')}
                        >
                            📝 Homework Results
                        </button>
                        <button
                            className={`px-6 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                                activeTab === 'exams'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            onClick={() => setActiveTab('exams')}
                        >
                            📋 Exam Results
                        </button>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-16">
                            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {/* Homework Results */}
                        {!loading && activeTab === 'homework' && (
                            <motion.div
                                key="homework"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {homeworkSubs.length === 0 ? (
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-10 text-center shadow-sm">
                                        <div className="text-5xl mb-3">📭</div>
                                        <p className="text-slate-500">No homework submitted yet.</p>
                                    </div>
                                ) : (
                                    homeworkSubs.map(sub => (
                                        <div key={sub.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200/60 p-5 hover:shadow-lg transition-shadow">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded-full">{sub.homework?.lesson?.class_room?.name}</span>
                                                        <span>→</span>
                                                        <span>{sub.homework?.lesson?.title}</span>
                                                    </div>
                                                    <p className="font-semibold text-slate-800 text-lg">{sub.homework?.title}</p>
                                                    <p className="text-sm text-slate-600">{sub.homework?.question}</p>
                                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                        <p className="text-xs text-slate-400 font-medium mb-1">Your Answer:</p>
                                                        <p className="text-sm text-slate-700">{sub.answer}</p>
                                                    </div>
                                                    {sub.teacher_feedback && (
                                                        <div className="bg-indigo-50/70 rounded-xl p-3 border border-indigo-100">
                                                            <p className="text-xs text-indigo-600 font-medium mb-1">📝 Teacher Feedback:</p>
                                                            <p className="text-sm text-indigo-800">{sub.teacher_feedback}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right min-w-[80px]">
                                                    {sub.score !== null ? (
                                                        <div>
                                                            <span className={`text-3xl font-bold ${
                                                                sub.score >= 70 ? 'text-emerald-600' :
                                                                sub.score >= 50 ? 'text-amber-600' : 'text-rose-600'
                                                            }`}>
                                                                {sub.score}
                                                            </span>
                                                            <span className="text-sm text-slate-400 ml-1">/ 100</span>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                                                            ⏳ Pending
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {/* Exam Results */}
                        {!loading && activeTab === 'exams' && (
                            <motion.div
                                key="exams"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {examSubs.length === 0 ? (
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-10 text-center shadow-sm">
                                        <div className="text-5xl mb-3">📭</div>
                                        <p className="text-slate-500">No exam submissions yet.</p>
                                    </div>
                                ) : (
                                    examSubs.map(sub => (
                                        <div key={sub.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200/60 p-5 hover:shadow-lg transition-shadow">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded-full">{sub.final_exam?.class_room?.name}</span>
                                                        <span>→</span>
                                                        <span>{sub.final_exam?.title}</span>
                                                    </div>
                                                    <p className="font-semibold text-slate-800 text-lg">{sub.question?.question}</p>
                                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                        <p className="text-xs text-slate-400 font-medium mb-1">Your Answer:</p>
                                                        <p className="text-sm text-slate-700">{sub.answer}</p>
                                                    </div>
                                                    {sub.teacher_feedback && (
                                                        <div className="bg-indigo-50/70 rounded-xl p-3 border border-indigo-100">
                                                            <p className="text-xs text-indigo-600 font-medium mb-1">📝 Teacher Feedback:</p>
                                                            <p className="text-sm text-indigo-800">{sub.teacher_feedback}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right min-w-[80px]">
                                                    {sub.score !== null ? (
                                                        <div>
                                                            <span className={`text-3xl font-bold ${
                                                                sub.score >= 70 ? 'text-emerald-600' :
                                                                sub.score >= 50 ? 'text-amber-600' : 'text-rose-600'
                                                            }`}>
                                                                {sub.score}
                                                            </span>
                                                            <span className="text-sm text-slate-400 ml-1">/ 100</span>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                                                            ⏳ Pending
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    )
}
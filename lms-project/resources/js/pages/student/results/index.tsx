import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Results', href: '/student/results' },
]

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
    const [homeworkSubs, setHomeworkSubs] = useState<HomeworkSubmission[]>([])
    const [examSubs, setExamSubs] = useState<ExamSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('homework')

    useEffect(() => {
        fetch('/api/student/results', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        }).then(r => r.json()).then(d => {
            setHomeworkSubs(Array.isArray(d.homework) ? d.homework : [])
            setExamSubs(Array.isArray(d.exams) ? d.exams : [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const homeworkAvg = homeworkSubs.filter(s => s.score !== null).length > 0
        ? Math.round(homeworkSubs.filter(s => s.score !== null).reduce((sum, s) => sum + (s.score ?? 0), 0) / homeworkSubs.filter(s => s.score !== null).length)
        : null

    const examAvg = examSubs.filter(s => s.score !== null).length > 0
        ? Math.round(examSubs.filter(s => s.score !== null).reduce((sum, s) => sum + (s.score ?? 0), 0) / examSubs.filter(s => s.score !== null).length)
        : null

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Results" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                <h1 className="text-2xl font-bold">My Results</h1>

                {/* Stats Cards */}
                {!loading && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border p-5 bg-blue-50">
                            <p className="text-sm text-blue-600 font-medium">Homework Submitted</p>
                            <p className="text-3xl font-bold text-blue-700 mt-1">{homeworkSubs.length}</p>
                        </div>
                        <div className="rounded-xl border p-5 bg-green-50">
                            <p className="text-sm text-green-600 font-medium">Homework Avg Score</p>
                            <p className="text-3xl font-bold text-green-700 mt-1">
                                {homeworkAvg !== null ? homeworkAvg + '%' : '-'}
                            </p>
                        </div>
                        <div className="rounded-xl border p-5 bg-purple-50">
                            <p className="text-sm text-purple-600 font-medium">Exam Avg Score</p>
                            <p className="text-3xl font-bold text-purple-700 mt-1">
                                {examAvg !== null ? examAvg + '%' : '-'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2">
                    <button
                        className={'px-4 py-2 rounded-lg text-sm font-medium ' + (activeTab === 'homework' ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50')}
                        onClick={() => setActiveTab('homework')}
                    >
                        📝 Homework Results
                    </button>
                    <button
                        className={'px-4 py-2 rounded-lg text-sm font-medium ' + (activeTab === 'exams' ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50')}
                        onClick={() => setActiveTab('exams')}
                    >
                        📋 Exam Results
                    </button>
                </div>

                {loading && <p className="text-gray-500">Loading...</p>}

                {/* Homework Results */}
                {!loading && activeTab === 'homework' && (
                    <div className="flex flex-col gap-3">
                        {homeworkSubs.length === 0 && (
                            <div className="rounded-xl border p-8 text-center text-gray-500">
                                No homework submitted yet.
                            </div>
                        )}
                        {homeworkSubs.map(sub => (
                            <div key={sub.id} className="rounded-xl border p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">{sub.homework?.lesson?.class_room?.name} → {sub.homework?.lesson?.title}</p>
                                        <p className="font-semibold mt-1">{sub.homework?.title}</p>
                                        <p className="text-sm text-gray-600 mt-1">{sub.homework?.question}</p>
                                        <div className="mt-2 rounded-lg bg-gray-50 p-2">
                                            <p className="text-xs text-gray-500 mb-1">Your Answer:</p>
                                            <p className="text-sm">{sub.answer}</p>
                                        </div>
                                        {sub.teacher_feedback && (
                                            <div className="mt-2 rounded-lg bg-blue-50 p-2">
                                                <p className="text-xs text-blue-600 font-medium">Teacher Feedback:</p>
                                                <p className="text-sm text-blue-700">{sub.teacher_feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 text-right">
                                        {sub.score !== null ? (
                                            <div className="flex flex-col items-end">
                                                <span className={'text-2xl font-bold ' + (sub.score >= 70 ? 'text-green-600' : sub.score >= 50 ? 'text-yellow-600' : 'text-red-600')}>
                                                    {sub.score}
                                                </span>
                                                <span className="text-xs text-gray-500">/ 100</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                                ⏳ Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Exam Results */}
                {!loading && activeTab === 'exams' && (
                    <div className="flex flex-col gap-3">
                        {examSubs.length === 0 && (
                            <div className="rounded-xl border p-8 text-center text-gray-500">
                                No exam submissions yet.
                            </div>
                        )}
                        {examSubs.map(sub => (
                            <div key={sub.id} className="rounded-xl border p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">{sub.final_exam?.class_room?.name} → {sub.final_exam?.title}</p>
                                        <p className="font-semibold mt-1">{sub.question?.question}</p>
                                        <div className="mt-2 rounded-lg bg-gray-50 p-2">
                                            <p className="text-xs text-gray-500 mb-1">Your Answer:</p>
                                            <p className="text-sm">{sub.answer}</p>
                                        </div>
                                        {sub.teacher_feedback && (
                                            <div className="mt-2 rounded-lg bg-blue-50 p-2">
                                                <p className="text-xs text-blue-600 font-medium">Teacher Feedback:</p>
                                                <p className="text-sm text-blue-700">{sub.teacher_feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 text-right">
                                        {sub.score !== null ? (
                                            <div className="flex flex-col items-end">
                                                <span className={'text-2xl font-bold ' + (sub.score >= 70 ? 'text-green-600' : sub.score >= 50 ? 'text-yellow-600' : 'text-red-600')}>
                                                    {sub.score}
                                                </span>
                                                <span className="text-xs text-gray-500">/ 100</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                                ⏳ Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </AppLayout>
    )
}
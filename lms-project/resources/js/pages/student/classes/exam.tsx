import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'

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
    const [answers, setAnswers] = useState<{[key: number]: string}>({})
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
        }).then(r => r.json()).then(d => { if (d?.name) setClassName(d.name) })

        fetch('/api/classes/' + classId + '/exam', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        }).then(r => r.json()).then(d => {
            if (d?.id) setExam(d)
            else setError(d.message ?? 'No exam found')
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [classId])

    function handleSubmit() {
        if (!exam) return

        const unanswered = exam.questions.filter(q => !answers[q.id]?.trim())
        if (unanswered.length > 0) {
            setMessage('Please answer all questions.')
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
        }).then(r => r.json()).then(d => {
            if (d.message === 'Exam submitted successfully') {
                setSubmitted(true)
                setMessage('✅ Exam submitted successfully! Your teacher will review it soon.')
            } else {
                setMessage('❌ ' + (d.message ?? 'Error occurred'))
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Final Exam" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                <h1 className="text-2xl font-bold">Final Exam</h1>

                {loading && <p className="text-gray-500">Loading...</p>}

                {!loading && error && (
                    <div className="rounded-xl border p-8 text-center text-gray-500">
                        {error === 'You must complete all lessons first'
                            ? '🔒 You must complete all lessons before taking the final exam.'
                            : error}
                    </div>
                )}

                {submitted && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                        <p className="text-2xl mb-2">✅</p>
                        <p className="text-green-700 font-semibold">Exam submitted successfully!</p>
                        <p className="text-gray-500 text-sm mt-1">Your teacher will review and grade it soon.</p>
                    </div>
                )}

                {!loading && !error && exam && !submitted && (
                    <div className="flex flex-col gap-6">
                        <div className="rounded-xl border p-5">
                            <h2 className="text-xl font-bold">{exam.title}</h2>
                            {exam.description && <p className="text-gray-500 mt-1">{exam.description}</p>}
                            <p className="text-sm text-gray-400 mt-1">Total Score: {exam.total_score} points</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {exam.questions?.map((q, index) => (
                                <div key={q.id} className="rounded-xl border p-5">
                                    <p className="font-semibold mb-3">
                                        <span className="text-blue-600 mr-2">Q{index + 1}.</span>
                                        {q.question}
                                    </p>
                                    <textarea
                                        className="w-full rounded-lg border px-3 py-2 text-sm"
                                        rows={4}
                                        placeholder="Write your answer here..."
                                        value={answers[q.id] ?? ''}
                                        onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>

                        {message && <p className="text-sm text-center">{message}</p>}

                        <button
                            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
                            onClick={handleSubmit}
                        >
                            Submit Exam
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
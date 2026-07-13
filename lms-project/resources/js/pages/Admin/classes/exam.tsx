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

export default function FinalExamAdmin({ classId }: Props) {
    const [className, setClassName] = useState('')
    const [exam, setExam] = useState<Exam | null>(null)
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [message, setMessage] = useState('')
    const [questions, setQuestions] = useState([{ question: '', order: 1 }])
    const [examForm, setExamForm] = useState({ title: '', description: '', total_score: 100 })

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Classes', href: '/admin/classes' },
        { title: className, href: '/admin/classes/' + classId },
        { title: 'Final Exam', href: '#' },
    ]

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        )
    }

    function loadData() {
        fetch('/api/classes/' + classId, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        }).then(r => r.json()).then(d => { if (d?.name) setClassName(d.name) })

        fetch('/api/classes/' + classId + '/exam', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        }).then(r => r.json()).then(d => {
            if (d?.id) setExam(d)
            setLoading(false)
        }).catch(() => setLoading(false))
    }

    useEffect(() => { loadData() }, [classId])

    function addQuestion() {
        setQuestions([...questions, { question: '', order: questions.length + 1 }])
    }

    function removeQuestion(index: number) {
        setQuestions(questions.filter((_, i) => i !== index))
    }

    function handleCreateExam() {
        if (!examForm.title || questions.some(q => !q.question)) {
            setMessage('Please fill all fields.')
            return
        }

        fetch('/api/classes/' + classId + '/exam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({
                title: examForm.title,
                description: examForm.description || null,
                total_score: examForm.total_score,
                questions: questions,
            }),
        }).then(r => r.json()).then(d => {
            if (d.id) {
                setMessage('✅ Exam created successfully!')
                loadData()
                setTimeout(() => { setShowCreateModal(false); setMessage('') }, 1500)
            } else {
                setMessage('❌ ' + (d.message ?? 'Error'))
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Final Exam" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Final Exam</h1>
                        <p className="text-gray-500 text-sm">{className}</p>
                    </div>
                    {!exam && (
                        <button
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            onClick={() => { setShowCreateModal(true); setMessage('') }}
                        >
                            + Create Exam
                        </button>
                    )}
                </div>

                {loading && <p className="text-gray-500">Loading...</p>}

                {!loading && !exam && (
                    <div className="rounded-xl border p-8 text-center text-gray-500">
                        No final exam created yet.
                    </div>
                )}

                {!loading && exam && (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-xl border p-5">
                            <h2 className="text-xl font-bold">{exam.title}</h2>
                            {exam.description && <p className="text-gray-500 mt-1">{exam.description}</p>}
                            <p className="text-sm text-gray-400 mt-1">Total Score: {exam.total_score}</p>
                        </div>

                        <h3 className="text-lg font-semibold">Questions ({exam.questions?.length ?? 0})</h3>

                        <div className="flex flex-col gap-3">
                            {exam.questions?.map((q, index) => (
                                <div key={q.id} className="rounded-xl border p-4">
                                    <div className="flex items-start gap-3">
                                        <span className="font-mono text-gray-400 text-sm mt-1">{index + 1}.</span>
                                        <p className="text-sm">{q.question}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Create Exam Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
                        <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl my-8">
                            <h2 className="text-lg font-bold mb-4">Create Final Exam</h2>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Exam Title *</label>
                                    <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Final Exam" value={examForm.title} onChange={e => setExamForm({ ...examForm, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea className="w-full rounded-lg border px-3 py-2 text-sm" rows={2} value={examForm.description} onChange={e => setExamForm({ ...examForm, description: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total Score</label>
                                    <input type="number" className="w-full rounded-lg border px-3 py-2 text-sm" value={examForm.total_score} onChange={e => setExamForm({ ...examForm, total_score: parseInt(e.target.value) })} />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium">Questions *</label>
                                        <button className="text-sm text-blue-600 hover:underline" onClick={addQuestion}>+ Add Question</button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {questions.map((q, index) => (
                                            <div key={index} className="flex gap-2">
                                                <span className="text-gray-400 text-sm mt-2">{index + 1}.</span>
                                                <textarea
                                                    className="flex-1 rounded-lg border px-3 py-2 text-sm"
                                                    rows={2}
                                                    placeholder={'Question ' + (index + 1)}
                                                    value={q.question}
                                                    onChange={e => {
                                                        const updated = [...questions]
                                                        updated[index].question = e.target.value
                                                        setQuestions(updated)
                                                    }}
                                                />
                                                {questions.length > 1 && (
                                                    <button className="text-red-500 hover:text-red-700 text-sm" onClick={() => removeQuestion(index)}>✕</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {message && <p className="text-sm text-center">{message}</p>}
                                <div className="flex gap-3">
                                    <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onClick={handleCreateExam}>Create Exam</button>
                                    <button className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
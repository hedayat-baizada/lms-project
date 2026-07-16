import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendance', href: '/teacher/attendance' },
]

interface AttendanceRequest {
    id: number
    status: string
    created_at: string
    teacher_note: string | null
    student: {
        id: number
        name: string
        email: string
    }
    lesson: {
        id: number
        title: string
        class_room: {
            id: number
            name: string
        }
    }
}

export default function TeacherAttendance() {
    const [requests, setRequests] = useState<AttendanceRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selected, setSelected] = useState<AttendanceRequest | null>(null)
    const [note, setNote] = useState('')
    const [message, setMessage] = useState('')
    const [filter, setFilter] = useState('pending')

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        )
    }

    function loadData() {
        setLoading(true)
        fetch('/api/attendance/pending', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        }).then(r => r.json()).then(d => {
            setRequests(Array.isArray(d) ? d : [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }

    useEffect(() => {
        loadData()
    }, [])

    function handleApprove(request: AttendanceRequest) {
        setSelected(request)
        setNote('')
        setMessage('')
        setShowModal(true)
    }

    function confirmApprove() {
        if (!selected) return

        fetch('/api/attendance/' + selected.id + '/approve', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({ teacher_note: note }),
        }).then(r => r.json()).then(d => {
            if (d.message === 'Attendance approved successfully') {
                setMessage('✅ Attendance approved!')
                loadData()
                setTimeout(() => { setShowModal(false); setMessage('') }, 1500)
            } else {
                setMessage('❌ ' + (d.message ?? 'Error'))
            }
        })
    }

    function handleReject(request: AttendanceRequest) {
        if (!confirm('Reject attendance for ' + request.student.name + '?')) return

        fetch('/api/attendance/' + request.id + '/reject', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({ teacher_note: '' }),
        }).then(r => r.json()).then(() => {
            loadData()
        })
    }

    const filtered = requests.filter(r => {
        if (filter === 'pending') return r.status === 'pending'
        if (filter === 'approved') return r.status === 'approved'
        if (filter === 'rejected') return r.status === 'rejected'
        return true
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Attendance Requests</h1>
                    <button
                        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={loadData}
                    >
                        🔄 Refresh
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    {['pending', 'approved', 'rejected', 'all'].map(f => (
                        <button
                            key={f}
                            className={'px-4 py-2 rounded-lg text-sm font-medium ' + (filter === f ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50 capitalize')}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'pending' ? '⏳ Pending' : f === 'approved' ? '✅ Approved' : f === 'rejected' ? '❌ Rejected' : '📋 All'}
                        </button>
                    ))}
                </div>

                {loading && <p className="text-gray-500">Loading...</p>}

                {!loading && filtered.length === 0 && (
                    <div className="rounded-xl border p-8 text-center text-gray-500">
                        No {filter} attendance requests.
                    </div>
                )}

                {!loading && filtered.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {filtered.map(request => (
                            <div key={request.id} className="rounded-xl border p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold">{request.student?.name}</span>
                                            <span className="text-xs text-gray-500">{request.student?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span>📚 {request.lesson?.class_room?.name}</span>
                                            <span>→</span>
                                            <span>📹 {request.lesson?.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={'text-xs px-2 py-1 rounded-full ' + (
                                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                request.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            )}>
                                                {request.status === 'pending' ? '⏳ Pending' : request.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(request.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {request.teacher_note && (
                                            <p className="text-xs text-gray-500 mt-1">Note: {request.teacher_note}</p>
                                        )}
                                    </div>

                                    {request.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                className="rounded-lg bg-green-600 px-4 py-2 text-white text-sm hover:bg-green-700"
                                                onClick={() => handleApprove(request)}
                                            >
                                                ✅ Approve
                                            </button>
                                            <button
                                                className="rounded-lg bg-red-100 px-4 py-2 text-red-700 text-sm hover:bg-red-200"
                                                onClick={() => handleReject(request)}
                                            >
                                                ❌ Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Approve Modal */}
                {showModal && selected && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                            <h2 className="text-lg font-bold mb-1">Approve Attendance</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Student: {selected.student?.name} | Lesson: {selected.lesson?.title}
                            </p>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Note (optional)</label>
                                    <textarea
                                        className="w-full rounded-lg border px-3 py-2 text-sm"
                                        rows={3}
                                        placeholder="Add a note for the student..."
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                    />
                                </div>
                                {message && <p className="text-sm text-center">{message}</p>}
                                <div className="flex gap-3">
                                    <button
                                        className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                        onClick={confirmApprove}
                                    >
                                        Confirm Approve
                                    </button>
                                    <button
                                        className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    )
}
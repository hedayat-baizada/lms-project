import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState, useRef } from 'react'

interface Homework {
    id: number
    title: string
    question: string
}

interface Lesson {
    id: number
    title: string
    type: string
    video_path: string | null
    video_url: string | null
    meet_link: string | null
    description: string | null
    is_unlocked: boolean
    video_watched: boolean
    homework_submitted: boolean
    homework: Homework | null
    release_date: string | null
    isReleased: boolean
}

interface Props {
    classId: number
}

function isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be')
}

function getYouTubeEmbedUrl(url: string): string {
    let videoId = ''
    if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/watch')) {
        const params = new URLSearchParams(url.split('?')[1])
        videoId = params.get('v') || ''
    } else if (url.includes('youtube.com/embed')) {
        return url
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

export default function StudentClassShow({ classId }: Props) {
    const [className, setClassName] = useState('')
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
    const [answer, setAnswer] = useState('')
    const [message, setMessage] = useState('')
    const [attendance, setAttendance] = useState<{ [key: number]: string }>({})
    const [videoEndedSent, setVideoEndedSent] = useState<{ [key: number]: boolean }>({})
    const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

    const [classStatus, setClassStatus] = useState({
        has_started: true,
        has_ended: false,
        is_active_now: true,
        start_date: null as string | null,
        end_date: null as string | null,
        status_message: null as string | null,
    })

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Classes', href: '/student/classes' },
        { title: className, href: '#' },
    ]

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        )
    }

    function getUrl(url: string) {
        return url.startsWith('http') ? url : 'https://' + url
    }

    function loadData() {
        fetch('/api/classes/' + classId, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(d => {
                if (d && d.id) {
                    setClassName(d.name)
                    setClassStatus({
                        has_started: d.has_started ?? true,
                        has_ended: d.has_ended ?? false,
                        is_active_now: d.is_active_now ?? true,
                        start_date: d.start_date_formatted || null,
                        end_date: d.end_date_formatted || null,
                        status_message: null,
                    })
                }
            })
            .catch(() => {})

        fetch('/api/classes/' + classId + '/lessons', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => {
                if (!r.ok) {
                    return r.json().then(data => {
                        if (data.message) {
                            setClassStatus(prev => ({ ...prev, status_message: data.message }))
                        }
                        throw new Error(data.message || 'Failed to load lessons')
                    })
                }
                return r.json()
            })
            .then(d => {
                const lessonList = Array.isArray(d) ? d : []
                setLessons(lessonList)
                setLoading(false)

                lessonList.forEach((lesson: Lesson) => {
                    if (lesson.type === 'online_meet' && lesson.is_unlocked) {
                        fetch('/api/lessons/' + lesson.id + '/attendance/status', {
                            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                            credentials: 'include',
                        })
                            .then(r => r.json())
                            .then(data => {
                                if (data.status !== 'not_requested') {
                                    setAttendance(prev => ({ ...prev, [lesson.id]: data.status }))
                                }
                            })
                    }
                })
            })
            .catch((err) => {
                setLessons([])
                setLoading(false)
                if (!classStatus.status_message) {
                    setClassStatus(prev => ({ ...prev, status_message: err.message || 'Could not load lessons' }))
                }
            })
    }

    useEffect(() => {
        loadData()
    }, [classId])

    function watchVideo(lessonId: number) {
        if (videoEndedSent[lessonId]) return

        fetch('/api/classes/' + classId + '/lessons/' + lessonId + '/watch', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
        }).then(() => {
            setVideoEndedSent(prev => ({ ...prev, [lessonId]: true }))
            loadData()
        })
    }

    function handleVideoEnded(lessonId: number) {
        const lesson = lessons.find(l => l.id === lessonId)
        if (lesson && lesson.is_unlocked && !lesson.video_watched && !videoEndedSent[lessonId]) {
            watchVideo(lessonId)
        }
    }

    function markYouTubeAsWatched(lessonId: number) {
        const lesson = lessons.find(l => l.id === lessonId)
        if (lesson && lesson.is_unlocked && !lesson.video_watched && !videoEndedSent[lessonId]) {
            watchVideo(lessonId)
        }
    }

    function requestAttendance(lessonId: number) {
        fetch('/api/lessons/' + lessonId + '/attendance/request', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
        }).then(r => r.json()).then(() => {
            setAttendance(prev => ({ ...prev, [lessonId]: 'pending' }))
        })
    }

    function submitHomework() {
        if (!answer.trim()) {
            setMessage('Please write your answer.')
            return
        }
        if (!selectedLesson || !selectedLesson.homework) return

        fetch('/api/lessons/' + selectedLesson.id + '/homework/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({ answer: answer }),
        }).then(r => r.json()).then(d => {
            if (d.message === 'Homework submitted successfully') {
                setMessage('Submitted successfully!')
                loadData()
                setTimeout(() => {
                    setShowModal(false)
                    setMessage('')
                    setAnswer('')
                }, 1500)
            } else {
                setMessage(d.message ?? 'Error occurred')
            }
        })
    }

    const isClassEnded = classStatus.has_ended
    const isClassNotStarted = !classStatus.has_started && !classStatus.has_ended
    const isClassActive = classStatus.is_active_now && !classStatus.has_ended

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={className} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-xl shadow-indigo-200/50">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="relative">
                        <h1 className="text-3xl font-bold tracking-tight">{className}</h1>
                        {classStatus.start_date && classStatus.end_date && (
                            <p className="mt-1 text-white/80 text-sm">
                                📅 {classStatus.start_date} — {classStatus.end_date}
                            </p>
                        )}
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                )}

                {!loading && isClassEnded && (
                    <div className="rounded-2xl bg-rose-50/80 backdrop-blur-sm border border-rose-200/50 p-6 text-center">
                        <p className="text-rose-700 font-medium text-lg">⛔ This class has ended.</p>
                        <p className="text-sm text-rose-500">Access to lessons is no longer available.</p>
                        {classStatus.end_date && (
                            <p className="text-xs text-rose-400 mt-1">Ended on: {classStatus.end_date}</p>
                        )}
                    </div>
                )}

                {!loading && isClassNotStarted && (
                    <div className="rounded-2xl bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 p-6 text-center">
                        <p className="text-amber-700 font-medium text-lg">⏳ This class hasn't started yet.</p>
                        <p className="text-sm text-amber-500">
                            Lessons will be available from {classStatus.start_date || 'the start date'}.
                        </p>
                    </div>
                )}

                {!loading && isClassActive && lessons.length === 0 && (
                    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-12 text-center">
                        <p className="text-slate-500 font-medium">No lessons available yet.</p>
                    </div>
                )}

                {!loading && isClassActive && lessons.length > 0 && (
                    <>
                        <div className="space-y-4">
                            {lessons.map((lesson) => {
                                const isLocked = !lesson.is_unlocked || !lesson.isReleased
                                const isCompleted = lesson.video_watched && lesson.homework_submitted
                                const isNotReleased = !lesson.isReleased

                                return (
                                    <div
                                        key={lesson.id}
                                        className={`rounded-2xl bg-white/70 backdrop-blur-sm border p-5 transition-all duration-300 ${
                                            isLocked
                                                ? 'border-slate-200/50 opacity-60'
                                                : 'border-white/50 shadow-lg shadow-slate-200/60 hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-0.5'
                                        }`}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 font-bold text-sm">
                                                    {lessons.indexOf(lesson) + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-lg font-semibold text-slate-800">
                                                            {lesson.title}
                                                        </h3>
                                                        {isNotReleased && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                                                                📅 Not Released
                                                            </span>
                                                        )}
                                                        {isLocked && !isNotReleased && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                                                                🔒 Locked
                                                            </span>
                                                        )}
                                                        {isCompleted && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                                                                ✅ Completed
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            lesson.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                        }`}>
                                                            {lesson.type === 'video' ? '🎥 Video' : '📹 Google Meet'}
                                                        </span>
                                                        {lesson.description && (
                                                            <span className="text-xs text-slate-500">{lesson.description}</span>
                                                        )}
                                                        {lesson.release_date && (
                                                            <span className="text-xs text-slate-400">
                                                                📅 {new Date(lesson.release_date).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {isNotReleased && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                                        📅 Not Released
                                                    </span>
                                                )}
                                                {isLocked && !isNotReleased && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                                                        🔒 Locked
                                                    </span>
                                                )}
                                                {!isLocked && lesson.type === 'online_meet' && lesson.meet_link && (
                                                    <>
                                                        <a
                                                            href={getUrl(lesson.meet_link)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-100 transition-colors"
                                                        >
                                                            Join Meet
                                                        </a>
                                                        {!lesson.video_watched && attendance[lesson.id] === undefined && (
                                                            <button
                                                                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                                                                onClick={() => requestAttendance(lesson.id)}
                                                            >
                                                                Request Attendance
                                                            </button>
                                                        )}
                                                        {attendance[lesson.id] === 'pending' && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                                                                ⏳ Pending
                                                            </span>
                                                        )}
                                                        {attendance[lesson.id] === 'rejected' && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                                                ❌ Rejected
                                                            </span>
                                                        )}
                                                        {(lesson.video_watched || attendance[lesson.id] === 'approved') && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                                ✅ Approved
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                                {!isLocked && lesson.homework && !lesson.homework_submitted && (
                                                    <button
                                                        className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600 hover:bg-purple-100 transition-colors"
                                                        onClick={() => {
                                                            setSelectedLesson(lesson)
                                                            setAnswer('')
                                                            setMessage('')
                                                            setShowModal(true)
                                                        }}
                                                    >
                                                        Submit Homework
                                                    </button>
                                                )}
                                                {!isLocked && lesson.homework && lesson.homework_submitted && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                        ✅ Submitted
                                                    </span>
                                                )}
                                                {!isLocked && lesson.type === 'video' && lesson.video_watched && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                        ✅ Watched
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {!isLocked && lesson.type === 'video' && (lesson.video_path || lesson.video_url) && (
                                            <div className="mt-3 ml-14 rounded-xl overflow-hidden border border-slate-200/50">
                                                {lesson.video_path ? (
                                                    <video
                                                        controls
                                                        className="w-full max-h-64 object-contain"
                                                        ref={el => { videoRefs.current[lesson.id] = el }}
                                                        onEnded={() => handleVideoEnded(lesson.id)}
                                                    >
                                                        <source src={`/storage/${lesson.video_path}`} />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : lesson.video_url && isYouTubeUrl(lesson.video_url) ? (
                                                    <div>
                                                        <iframe
                                                            className="w-full aspect-video"
                                                            src={getYouTubeEmbedUrl(lesson.video_url)}
                                                            title="YouTube video player"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                        <div className="p-2 bg-slate-50 text-center">
                                                            <button
                                                                onClick={() => markYouTubeAsWatched(lesson.id)}
                                                                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                                                                disabled={lesson.video_watched}
                                                            >
                                                                {lesson.video_watched ? '✅ Watched' : '📝 Mark as Watched'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : lesson.video_url ? (
                                                    <div className="p-4 text-center bg-slate-50">
                                                        <a
                                                            href={getUrl(lesson.video_url)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                                                        >
                                                            Watch Video
                                                        </a>
                                                        <button
                                                            onClick={() => markYouTubeAsWatched(lesson.id)}
                                                            className="ml-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                                                            disabled={lesson.video_watched}
                                                        >
                                                            {lesson.video_watched ? '✅ Watched' : 'Mark as Watched'}
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}

                                        {!isLocked && lesson.homework && (
                                            <div className="mt-3 ml-14 rounded-xl bg-purple-50/80 p-4 border border-purple-100/50">
                                                <p className="text-sm font-semibold text-purple-700">
                                                    📝 {lesson.homework.title}
                                                </p>
                                                <p className="text-sm text-slate-600 mt-1">{lesson.homework.question}</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <a
                            href={'/student/classes/' + classId + '/exam'}
                            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-white font-semibold hover:shadow-lg hover:shadow-emerald-200 hover:scale-[1.02] transition-all text-center block"
                        >
                            📝 Take Final Exam
                        </a>
                    </>
                )}

                {showModal && selectedLesson && selectedLesson.homework && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative max-h-[90vh] overflow-y-auto">
                            <div className="relative">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2 mb-2">
                                    📝 Homework
                                </h2>
                                <p className="text-sm text-slate-500 mb-4">{selectedLesson.title}</p>
                                <div className="rounded-xl bg-purple-50/80 p-4 mb-4 border border-purple-100/50">
                                    <p className="text-sm font-semibold text-purple-700">{selectedLesson.homework.title}</p>
                                    <p className="text-sm text-slate-600 mt-1">{selectedLesson.homework.question}</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Answer</label>
                                        <textarea
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                                            placeholder="Write your answer here..."
                                            rows={5}
                                            value={answer}
                                            onChange={e => setAnswer(e.target.value)}
                                        />
                                    </div>
                                    {message && (
                                        <div className={`text-sm text-center p-2 rounded-lg ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                            {message}
                                        </div>
                                    )}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 hover:scale-[1.02] transition-all"
                                            onClick={submitHomework}
                                        >
                                            Submit
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
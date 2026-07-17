import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye, Video, Monitor, BookOpen, List, Calendar, FileText, X, Pencil, Users, Mail, UserCheck } from 'lucide-react'

// ===== Interfaces =====
interface Teacher {
    id: number
    name: string
    email: string
}

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
    order: number
    homework: Homework | null
}

interface ClassRoom {
    id: number
    name: string
    type: string
    level: string | null
    has_video: boolean
    description: string | null
    is_active: boolean
    teacher_id: number | null
    teacher?: { id: number; name: string }
    start_date: string | null
    end_date: string | null
}

interface Student {
    id: number
    name: string
    email: string
}

interface Props {
    classId: number
}

export default function ClassShow({ classId }: Props) {
    const [classRoom, setClassRoom] = useState<ClassRoom | null>(null)
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [studentsLoading, setStudentsLoading] = useState(true)
    const [showLessonModal, setShowLessonModal] = useState(false)
    const [showHomeworkModal, setShowHomeworkModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
    const [message, setMessage] = useState('')
    const [homeworkMessage, setHomeworkMessage] = useState('')
    const [editMessage, setEditMessage] = useState('')
    const [studentRemoveMessage, setStudentRemoveMessage] = useState('')

    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [editVideoFile, setEditVideoFile] = useState<File | null>(null)

    const [editForm, setEditForm] = useState({
        name: '',
        type: 'english',
        level: '',
        has_video: true,
        description: '',
        is_active: true,
        teacher_id: '',
        start_date: '',
        end_date: '',
    })
    const [teachers, setTeachers] = useState<Teacher[]>([])

    const [lessonForm, setLessonForm] = useState({
        title: '',
        type: 'video',
        video_url: '',
        meet_link: '',
        description: '',
        order: 1,
    })

    const [homeworkForm, setHomeworkForm] = useState({
        title: '',
        question: '',
    })

    const [editLessonForm, setEditLessonForm] = useState({
        title: '',
        type: 'video',
        video_url: '',
        meet_link: '',
        description: '',
        order: 1,
    })

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Classes', href: '/admin/classes' },
        { title: classRoom?.name ?? 'Class', href: '#' },
    ]

    function getUrl(url: string) {
        return url.startsWith('http') ? url : 'https://' + url
    }

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        )
    }

    function loadData() {
        fetch('/api/classes/' + classId, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        }).then(r => r.json()).then(d => {
            if (d && d.id) setClassRoom(d)
        })

        fetch('/api/classes/' + classId + '/lessons', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        }).then(r => r.json()).then(d => {
            setLessons(Array.isArray(d) ? d : [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }

    function loadStudents() {
        setStudentsLoading(true)
        fetch('/api/classes/' + classId + '/students', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => {
                setStudents(Array.isArray(data) ? data : [])
                setStudentsLoading(false)
            })
            .catch(() => {
                setStudents([])
                setStudentsLoading(false)
            })
    }

    useEffect(() => {
        fetch('/api/admin/teachers', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => setTeachers(Array.isArray(data) ? data : []))
            .catch(() => {})
    }, [])

    useEffect(() => {
        loadData()
        loadStudents()
    }, [classId])

    function buildLessonFormData(data: any, file: File | null) {
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('type', data.type)
        formData.append('order', String(data.order))
        if (data.description) formData.append('description', data.description)

        if (file) {
            formData.append('video_file', file)
        } else {
            if (data.video_url) formData.append('video_url', data.video_url)
            if (data.meet_link) formData.append('meet_link', data.meet_link)
        }

        return formData
    }

    function openEditClassModal() {
        if (!classRoom) return
        setEditForm({
            name: classRoom.name,
            type: classRoom.type,
            level: classRoom.level ?? '',
            has_video: classRoom.has_video ?? true,
            description: classRoom.description ?? '',
            is_active: classRoom.is_active ?? true,
            teacher_id: classRoom.teacher_id?.toString() ?? '',
            start_date: classRoom.start_date || '',
            end_date: classRoom.end_date || '',
        })
        setEditMessage('')
        setShowEditModal(true)
    }

    function handleUpdateClass(e: React.FormEvent) {
        e.preventDefault()
        if (!editForm.name || !editForm.teacher_id) {
            setEditMessage('Please select a teacher and enter a class name.')
            return
        }

        fetch('/api/classes/' + classId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({
                name: editForm.name,
                type: editForm.type,
                level: editForm.level || null,
                has_video: editForm.has_video,
                description: editForm.description || null,
                is_active: editForm.is_active,
                teacher_id: parseInt(editForm.teacher_id),
                start_date: editForm.start_date || null,
                end_date: editForm.end_date || null,
            }),
        })
            .then(r => r.json())
            .then(data => {
                if (data.id) {
                    setEditMessage('✅ Class updated successfully!')
                    loadData()
                    setTimeout(() => {
                        setShowEditModal(false)
                        setEditMessage('')
                    }, 1500)
                } else {
                    setEditMessage('❌ ' + (data.message ?? 'Error'))
                }
            })
            .catch(() => setEditMessage('❌ Network error'))
    }

    function handleAddLesson() {
        if (!lessonForm.title) { setMessage('Please fill required fields.'); return }

        if (lessonForm.type === 'video' && !videoFile && !lessonForm.video_url) {
            setMessage('Please upload a video file or provide a video URL.')
            return
        }

        const formData = buildLessonFormData(lessonForm, videoFile)

        fetch('/api/classes/' + classId + '/lessons', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: formData,
        }).then(r => r.json()).then(d => {
            if (d.id) {
                setMessage('✅ Lesson added!')
                loadData()
                setVideoFile(null)
                setTimeout(() => { setShowLessonModal(false); setMessage('') }, 1500)
            } else {
                setMessage('❌ ' + (d.message ?? 'Error'))
            }
        })
    }

    function handleEditLesson() {
        if (!selectedLesson) return
        if (!editLessonForm.title) { setEditMessage('Please fill required fields.'); return }

        const formData = buildLessonFormData(editLessonForm, editVideoFile)
        formData.append('_method', 'PUT')

        fetch('/api/classes/' + classId + '/lessons/' + selectedLesson.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: formData,
        }).then(r => r.json()).then(d => {
            if (d.id) {
                setEditMessage('✅ Updated!')
                loadData()
                setEditVideoFile(null)
                setTimeout(() => { setShowEditModal(false); setEditMessage('') }, 1500)
            } else {
                setEditMessage('❌ ' + (d.message ?? 'Error'))
            }
        })
    }

    function handleAddHomework() {
        if (!homeworkForm.title || !homeworkForm.question) { setHomeworkMessage('Please fill all fields.'); return }
        if (!selectedLesson) return

        fetch('/api/lessons/' + selectedLesson.id + '/homework', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({ title: homeworkForm.title, question: homeworkForm.question }),
        }).then(r => r.json()).then(d => {
            if (d.id) {
                setHomeworkMessage('✅ Homework added!')
                loadData()
                setTimeout(() => { setShowHomeworkModal(false); setHomeworkMessage('') }, 1500)
            } else {
                setHomeworkMessage('❌ ' + (d.message ?? 'Error'))
            }
        })
    }

    function handleDeleteLesson(lesson: Lesson) {
        if (!confirm('Are you sure you want to delete "' + lesson.title + '"?')) return

        fetch('/api/classes/' + classId + '/lessons/' + lesson.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
        }).then(() => loadData())
    }

    function openEditLesson(lesson: Lesson) {
        setSelectedLesson(lesson)
        setEditLessonForm({
            title: lesson.title,
            type: lesson.type,
            video_url: lesson.video_url ?? '',
            meet_link: lesson.meet_link ?? '',
            description: lesson.description ?? '',
            order: lesson.order,
        })
        setEditVideoFile(null)
        setEditMessage('')
        setShowEditModal(true)
    }

    // --- Students Management ---
    function handleRemoveStudent(studentId: number) {
        if (!confirm('Are you sure you want to remove this student from the class?')) return

        fetch(`/api/classes/${classId}/students/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Error occurred')
                    })
                }
                return response.json()
            })
            .then(() => {
                setStudentRemoveMessage('✅ Student removed!')
                loadStudents()
                setTimeout(() => setStudentRemoveMessage(''), 2000)
            })
            .catch(error => {
                setStudentRemoveMessage('❌ ' + error.message)
                setTimeout(() => setStudentRemoveMessage(''), 3000)
            })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={classRoom?.name ?? 'Class'} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-xl shadow-indigo-200/50">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                                <BookOpen className="h-8 w-8" />
                                {classRoom?.name}
                            </h1>
                            <p className="mt-1 text-white/80 text-sm flex items-center gap-2">
                                {classRoom?.type === 'english' ? 'English Class' : 'Computer Class'}
                                {classRoom?.teacher && (
                                    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                                        👨‍🏫 {classRoom.teacher.name}
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-all shadow-lg shadow-black/10"
                                onClick={openEditClassModal}
                            >
                                <Pencil className="h-4 w-4" />
                                Edit Class
                            </button>
                            <a
                                href={'/admin/classes/' + classId + '/exam'}
                                className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-all shadow-lg shadow-black/10"
                            >
                                <FileText className="h-4 w-4" />
                                Final Exam
                            </a>
                            <button
                                className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-white/30 transition-all shadow-lg shadow-black/10 hover:shadow-black/20"
                                onClick={() => {
                                    setLessonForm({ title: '', type: 'video', video_url: '', meet_link: '', description: '', order: lessons.length + 1 })
                                    setVideoFile(null)
                                    setMessage('')
                                    setShowLessonModal(true)
                                }}
                            >
                                <Plus className="h-4 w-4" />
                                Add Lesson
                            </button>
                        </div>
                    </div>
                </div>

                {/* Student Remove Status Message */}
                {studentRemoveMessage && (
                    <div className={`rounded-xl px-4 py-3 text-sm font-medium ${studentRemoveMessage.includes('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {studentRemoveMessage}
                    </div>
                )}

                {/* Two-Column Layout: Lessons + Students */}
                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Lessons Column - takes 3/4 */}
                    <div className="lg:col-span-3">
                        {loading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            </div>
                        )}
                        {!loading && lessons.length === 0 && (
                            <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-12 text-center">
                                <List className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium">No lessons yet.</p>
                                <p className="text-sm text-slate-400 mt-1">Add your first lesson using the button above.</p>
                            </div>
                        )}
                        {!loading && lessons.length > 0 && (
                            <div className="space-y-4">
                                {lessons.map((lesson, index) => (
                                    <div key={lesson.id} className="group rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-5 hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-300">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-slate-800">{lesson.title}</h3>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${lesson.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                            {lesson.type === 'video' ? <Video className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                                                            {lesson.type === 'video' ? 'Video' : 'Online Meet'}
                                                        </span>
                                                        <span className="text-xs text-slate-400">Order: {lesson.order}</span>
                                                        {lesson.description && (
                                                            <span className="text-xs text-slate-500 truncate max-w-[200px]">{lesson.description}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {lesson.type === 'video' && (lesson.video_path || lesson.video_url) && (
                                                    <a
                                                        href={lesson.video_path ? `/storage/${lesson.video_path}` : getUrl(lesson.video_url!)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                        Watch
                                                    </a>
                                                )}
                                                {lesson.type === 'online_meet' && lesson.meet_link && (
                                                    <a
                                                        href={getUrl(lesson.meet_link)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-100 transition-colors"
                                                    >
                                                        <Monitor className="h-3 w-3" />
                                                        Join
                                                    </a>
                                                )}
                                                {lesson.type === 'video' && (
                                                    <button
                                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${lesson.homework ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700'}`}
                                                        onClick={() => {
                                                            setSelectedLesson(lesson)
                                                            setHomeworkForm({ title: '', question: '' })
                                                            setHomeworkMessage('')
                                                            setShowHomeworkModal(true)
                                                        }}
                                                    >
                                                        <BookOpen className="h-3 w-3" />
                                                        {lesson.homework ? 'Homework' : '+ Homework'}
                                                    </button>
                                                )}
                                                <button
                                                    className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600 hover:bg-yellow-100 transition-colors"
                                                    onClick={() => openEditLesson(lesson)}
                                                >
                                                    <Edit className="h-3 w-3" />
                                                    Edit
                                                </button>
                                                <button
                                                    className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                                                    onClick={() => handleDeleteLesson(lesson)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {lesson.type === 'video' && lesson.video_path && (
                                            <div className="mt-3 ml-14 rounded-xl overflow-hidden border border-slate-200/50 bg-slate-50/50">
                                                <video controls className="w-full max-h-64 object-contain">
                                                    <source src={`/storage/${lesson.video_path}`} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        )}

                                        {lesson.homework && (
                                            <div className="mt-3 ml-14 rounded-xl bg-purple-50/80 p-4 border border-purple-100/50">
                                                <p className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    {lesson.homework.title}
                                                </p>
                                                <p className="text-sm text-slate-600 mt-1">{lesson.homework.question}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Students Column - takes 1/4 */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 overflow-hidden sticky top-6">
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-indigo-500" />
                                    Enrolled Students
                                    <span className="text-xs font-normal text-slate-400 ml-1">
                                        ({students.length})
                                    </span>
                                </h2>
                                <button
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-all"
                                    onClick={() => router.visit(`/admin/classes/${classId}/enroll`)}
                                >
                                    + Add
                                </button>
                            </div>

                            <div className="p-3 max-h-[500px] overflow-y-auto">
                                {studentsLoading ? (
                                    <div className="flex justify-center items-center py-6">
                                        <div className="w-6 h-6 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                    </div>
                                ) : students.length === 0 ? (
                                    <div className="text-center py-6">
                                        <Users className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                        <p className="text-slate-500 text-xs">No students enrolled.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {students.map((student) => (
                                            <div key={student.id} className="py-2 flex items-center justify-between hover:bg-indigo-50/30 px-2 rounded-lg transition-colors">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-medium text-xs">
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-slate-700 truncate">{student.name}</p>
                                                        <p className="text-[10px] text-slate-400 truncate flex items-center gap-0.5">
                                                            <Mail className="h-2.5 w-2.5" />
                                                            {student.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="p-1 rounded-full text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                                    onClick={() => handleRemoveStudent(student.id)}
                                                    title="Remove from class"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Class Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative max-h-[90vh] overflow-y-auto">
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl"></div>
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-orange-300/20 blur-2xl"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                                        <Pencil className="h-6 w-6 text-yellow-500" />
                                        Edit Class
                                    </h2>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="rounded-full p-1.5 hover:bg-slate-100 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateClass} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Class Name *</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                                        <select
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            value={editForm.type}
                                            onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                                            required
                                        >
                                            <option value="english">English</option>
                                            <option value="computer">Computer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                                        <select
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            value={editForm.level}
                                            onChange={e => setEditForm({ ...editForm, level: e.target.value })}
                                        >
                                            <option value="">No Level</option>
                                            <option value="prep_cel">Prep-CEL</option>
                                            <option value="cel">CEL</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Teacher *</label>
                                        <select
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            value={editForm.teacher_id}
                                            onChange={e => setEditForm({ ...editForm, teacher_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map(t => (
                                                <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                                value={editForm.start_date}
                                                onChange={e => setEditForm({ ...editForm, start_date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                                value={editForm.end_date}
                                                onChange={e => setEditForm({ ...editForm, end_date: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            rows={3}
                                            value={editForm.description}
                                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={editForm.has_video}
                                                onChange={e => setEditForm({ ...editForm, has_video: e.target.checked })}
                                                className="rounded border-slate-300 text-yellow-600 focus:ring-yellow-500"
                                            />
                                            Has Video
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={editForm.is_active}
                                                onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                                                className="rounded border-slate-300 text-yellow-600 focus:ring-yellow-500"
                                            />
                                            Active
                                        </label>
                                    </div>

                                    {editMessage && (
                                        <div className={`text-sm text-center p-2 rounded-lg ${editMessage.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                            {editMessage}
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="submit"
                                            className="flex-1 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-yellow-200 hover:shadow-lg hover:shadow-yellow-300 hover:scale-[1.02] transition-all"
                                        >
                                            Update Class
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                            onClick={() => setShowEditModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Lesson Modal */}
                {showLessonModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative max-h-[90vh] overflow-y-auto">
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl"></div>
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-purple-300/20 blur-2xl"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                                        <Plus className="h-6 w-6 text-indigo-500" />
                                        Add New Lesson
                                    </h2>
                                    <button onClick={() => setShowLessonModal(false)} className="rounded-full p-1.5 hover:bg-slate-100 transition-colors">
                                        <X className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="lesson-title" className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                        <input
                                            id="lesson-title"
                                            type="text"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            placeholder="Lesson title"
                                            value={lessonForm.title}
                                            onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lesson-type" className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                                        <select
                                            id="lesson-type"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            value={lessonForm.type}
                                            onChange={e => setLessonForm({ ...lessonForm, type: e.target.value })}
                                        >
                                            <option value="video">🎥 Video</option>
                                            <option value="online_meet">📹 Google Meet</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="lesson-order" className="block text-sm font-medium text-slate-700 mb-1">Order *</label>
                                        <input
                                            id="lesson-order"
                                            type="number"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            value={lessonForm.order}
                                            onChange={e => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    {lessonForm.type === 'video' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Video File</label>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null
                                                        setVideoFile(file)
                                                        if (file) setLessonForm({ ...lessonForm, video_url: '' })
                                                    }}
                                                />
                                                <p className="text-xs text-slate-400 mt-1">Supported: MP4, AVI, MOV, MKV (max 20MB)</p>
                                            </div>
                                            <div className="relative flex items-center gap-2">
                                                <hr className="flex-1 border-slate-200" />
                                                <span className="text-xs text-slate-400">OR</span>
                                                <hr className="flex-1 border-slate-200" />
                                            </div>
                                            <div>
                                                <label htmlFor="lesson-video" className="block text-sm font-medium text-slate-700 mb-1">Video URL (YouTube/Drive)</label>
                                                <input
                                                    id="lesson-video"
                                                    type="text"
                                                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                                    placeholder="https://youtube.com/..."
                                                    value={lessonForm.video_url}
                                                    onChange={e => {
                                                        setLessonForm({ ...lessonForm, video_url: e.target.value })
                                                        if (e.target.value) setVideoFile(null)
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {lessonForm.type === 'online_meet' && (
                                        <div>
                                            <label htmlFor="lesson-meet" className="block text-sm font-medium text-slate-700 mb-1">Meet Link</label>
                                            <input
                                                id="lesson-meet"
                                                type="text"
                                                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                                placeholder="Google Meet link"
                                                value={lessonForm.meet_link}
                                                onChange={e => setLessonForm({ ...lessonForm, meet_link: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="lesson-desc" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea
                                            id="lesson-desc"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            rows={3}
                                            value={lessonForm.description}
                                            onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
                                        />
                                    </div>
                                    {message && <div className={`text-sm text-center p-2 rounded-lg ${message.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{message}</div>}
                                    <div className="flex gap-3 pt-2">
                                        <button className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] transition-all" onClick={handleAddLesson}>Add Lesson</button>
                                        <button className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all" onClick={() => setShowLessonModal(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Lesson Modal */}
                {showEditModal && selectedLesson && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative max-h-[90vh] overflow-y-auto">
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl"></div>
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-orange-300/20 blur-2xl"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                                        <Edit className="h-6 w-6 text-yellow-500" />
                                        Edit Lesson
                                    </h2>
                                    <button onClick={() => setShowEditModal(false)} className="rounded-full p-1.5 hover:bg-slate-100 transition-colors">
                                        <X className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                        <input
                                            id="edit-title"
                                            type="text"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            value={editLessonForm.title}
                                            onChange={e => setEditLessonForm({ ...editLessonForm, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-type" className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                                        <select
                                            id="edit-type"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            value={editLessonForm.type}
                                            onChange={e => {
                                                setEditLessonForm({ ...editLessonForm, type: e.target.value })
                                                setEditVideoFile(null)
                                            }}
                                        >
                                            <option value="video">🎥 Video</option>
                                            <option value="online_meet">📹 Google Meet</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="edit-order" className="block text-sm font-medium text-slate-700 mb-1">Order *</label>
                                        <input
                                            id="edit-order"
                                            type="number"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            value={editLessonForm.order}
                                            onChange={e => setEditLessonForm({ ...editLessonForm, order: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    {editLessonForm.type === 'video' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Replace Video File (optional)</label>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition file:mr-4 file:rounded-full file:border-0 file:bg-yellow-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-yellow-600 hover:file:bg-yellow-100"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null
                                                        setEditVideoFile(file)
                                                        if (file) setEditLessonForm({ ...editLessonForm, video_url: '' })
                                                    }}
                                                />
                                                {selectedLesson.video_path && (
                                                    <p className="text-xs text-emerald-600 mt-1">Current: {selectedLesson.video_path.split('/').pop()}</p>
                                                )}
                                            </div>
                                            <div className="relative flex items-center gap-2">
                                                <hr className="flex-1 border-slate-200" />
                                                <span className="text-xs text-slate-400">OR</span>
                                                <hr className="flex-1 border-slate-200" />
                                            </div>
                                            <div>
                                                <label htmlFor="edit-video" className="block text-sm font-medium text-slate-700 mb-1">Video URL</label>
                                                <input
                                                    id="edit-video"
                                                    type="text"
                                                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                                    value={editLessonForm.video_url}
                                                    onChange={e => {
                                                        setEditLessonForm({ ...editLessonForm, video_url: e.target.value })
                                                        if (e.target.value) setEditVideoFile(null)
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {editLessonForm.type === 'online_meet' && (
                                        <div>
                                            <label htmlFor="edit-meet" className="block text-sm font-medium text-slate-700 mb-1">Meet Link</label>
                                            <input
                                                id="edit-meet"
                                                type="text"
                                                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                                value={editLessonForm.meet_link}
                                                onChange={e => setEditLessonForm({ ...editLessonForm, meet_link: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="edit-desc" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea
                                            id="edit-desc"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            rows={3}
                                            value={editLessonForm.description}
                                            onChange={e => setEditLessonForm({ ...editLessonForm, description: e.target.value })}
                                        />
                                    </div>
                                    {editMessage && <div className={`text-sm text-center p-2 rounded-lg ${editMessage.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{editMessage}</div>}
                                    <div className="flex gap-3 pt-2">
                                        <button className="flex-1 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-yellow-200 hover:shadow-lg hover:shadow-yellow-300 hover:scale-[1.02] transition-all" onClick={handleEditLesson}>Update</button>
                                        <button className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Homework Modal */}
                {showHomeworkModal && selectedLesson && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative">
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-purple-300/20 blur-2xl"></div>
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-pink-300/20 blur-2xl"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                                            <FileText className="h-6 w-6 text-purple-500" />
                                            Add Homework
                                        </h2>
                                        <p className="text-sm text-slate-500 mt-1">For: {selectedLesson.title}</p>
                                    </div>
                                    <button onClick={() => setShowHomeworkModal(false)} className="rounded-full p-1.5 hover:bg-slate-100 transition-colors">
                                        <X className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="hw-title" className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                        <input
                                            id="hw-title"
                                            type="text"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                                            placeholder="Homework title"
                                            value={homeworkForm.title}
                                            onChange={e => setHomeworkForm({ ...homeworkForm, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="hw-question" className="block text-sm font-medium text-slate-700 mb-1">Question *</label>
                                        <textarea
                                            id="hw-question"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                                            rows={4}
                                            placeholder="Write the homework question..."
                                            value={homeworkForm.question}
                                            onChange={e => setHomeworkForm({ ...homeworkForm, question: e.target.value })}
                                        />
                                    </div>
                                    {homeworkMessage && <div className={`text-sm text-center p-2 rounded-lg ${homeworkMessage.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{homeworkMessage}</div>}
                                    <div className="flex gap-3 pt-2">
                                        <button className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 hover:scale-[1.02] transition-all" onClick={handleAddHomework}>Add Homework</button>
                                        <button className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all" onClick={() => setShowHomeworkModal(false)}>Cancel</button>
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
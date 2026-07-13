import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Users, UserPlus, Plus, X, BookOpen, Calendar, UserCheck, Pencil, Trash2 } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Students', href: '/admin/students' },
]

interface Student {
    id: number
    name: string
    email: string
}

interface ClassRoom {
    id: number
    name: string
    type: string
}

interface Teacher {
    id: number
    name: string
}

export default function StudentsIndex() {
    const [students, setStudents] = useState<Student[]>([])
    const [classes, setClasses] = useState<ClassRoom[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [loading, setLoading] = useState(true)
    const [showEnrollModal, setShowEnrollModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [enrollForm, setEnrollForm] = useState({ class_room_id: '', teacher_id: '' })
    const [addForm, setAddForm] = useState({ name: '', email: '', password: '' })
    const [editForm, setEditForm] = useState({ name: '', email: '', password: '' })
    const [enrollMessage, setEnrollMessage] = useState('')
    const [addMessage, setAddMessage] = useState('')
    const [editMessage, setEditMessage] = useState('')

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        )
    }

    function loadData() {
        Promise.all([
            fetch('/api/admin/students', { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' }).then(r => r.json()),
            fetch('/api/classes', { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' }).then(r => r.json()),
            fetch('/api/admin/teachers', { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'include' }).then(r => r.json()),
        ]).then(([s, c, t]) => {
            setStudents(Array.isArray(s) ? s : [])
            setClasses(Array.isArray(c) ? c : [])
            setTeachers(Array.isArray(t) ? t : [])
            setLoading(false)
        })
    }

    useEffect(() => { loadData() }, [])

    function handleAddStudent() {
        if (!addForm.name || !addForm.email || !addForm.password) {
            setAddMessage('Please fill all fields.')
            return
        }

        fetch('/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({ ...addForm, role: 'student' }),
        }).then(r => r.json()).then(d => {
            if (d.id) {
                setAddMessage('✅ Student created successfully!')
                loadData()
                setTimeout(() => { setShowAddModal(false); setAddMessage(''); setAddForm({ name: '', email: '', password: '' }) }, 1500)
            } else {
                setAddMessage('❌ ' + (d.message ?? 'Error occurred'))
            }
        })
    }

    function handleEditStudent() {
        if (!selectedStudent || !editForm.name || !editForm.email) {
            setEditMessage('Please fill required fields.')
            return
        }

        fetch('/api/admin/users/' + selectedStudent.id, {
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
                email: editForm.email,
                ...(editForm.password ? { password: editForm.password } : {}),
            }),
        }).then(r => r.json()).then(d => {
            if (d.id) {
                setEditMessage('✅ Student updated successfully!')
                loadData()
                setTimeout(() => { setShowEditModal(false); setEditMessage('') }, 1500)
            } else {
                setEditMessage('❌ ' + (d.message ?? 'Error occurred'))
            }
        })
    }

    function handleDeleteStudent(student: Student) {
        if (!confirm('Are you sure you want to delete ' + student.name + '? This cannot be undone.')) return

        fetch('/api/admin/users/' + student.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
        }).then(() => loadData())
    }

    function handleEnroll() {
        if (!selectedStudent || !enrollForm.class_room_id || !enrollForm.teacher_id) {
            setEnrollMessage('Please select class and teacher.')
            return
        }

        fetch('/api/classes/' + enrollForm.class_room_id + '/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify({
                student_id: selectedStudent.id,
                teacher_id: enrollForm.teacher_id,
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error occurred');
                });
            }
            return response.json();
        })
        .then(d => {
            setEnrollMessage('✅ ' + d.message);
            loadData();
            setTimeout(() => {
                setShowEnrollModal(false);
                setEnrollMessage('');
                setSelectedStudent(null);
                setEnrollForm({ class_room_id: '', teacher_id: '' });
            }, 2000);
        })
        .catch(error => {
            setEnrollMessage('❌ ' + error.message);
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">

                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-xl shadow-indigo-200/50">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                                <Users className="h-8 w-8" />
                                All Students
                            </h1>
                            <p className="mt-1 text-white/80 text-sm">
                                Manage your student body and enrollments
                            </p>
                        </div>
                        <button
                            className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-white/30 transition-all shadow-lg shadow-black/10 hover:shadow-black/20"
                            onClick={() => { setAddForm({ name: '', email: '', password: '' }); setAddMessage(''); setShowAddModal(true) }}
                        >
                            <Plus className="h-4 w-4" />
                            Add Student
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                )}

                {!loading && students.length === 0 && (
                    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-12 text-center">
                        <Users className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">No students found.</p>
                        <p className="text-sm text-slate-400 mt-1">Click "Add Student" to get started.</p>
                    </div>
                )}

                {!loading && students.length > 0 && (
                    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50/80 text-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">#</th>
                                        <th className="px-6 py-4 text-left font-semibold">Name</th>
                                        <th className="px-6 py-4 text-left font-semibold">Email</th>
                                        <th className="px-6 py-4 text-left font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-indigo-50/50 transition-colors duration-150">
                                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">{index + 1}</td>
                                            <td className="px-6 py-4 font-medium text-slate-800">{student.name}</td>
                                            <td className="px-6 py-4 text-slate-500">{student.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-all hover:shadow-sm"
                                                        onClick={() => {
                                                            setSelectedStudent(student)
                                                            setEnrollForm({ class_room_id: '', teacher_id: '' })
                                                            setEnrollMessage('')
                                                            setShowEnrollModal(true)
                                                        }}
                                                    >
                                                        <UserCheck className="h-3.5 w-3.5" />
                                                        Enroll
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-600 hover:bg-yellow-100 transition-all hover:shadow-sm"
                                                        onClick={() => {
                                                            setSelectedStudent(student)
                                                            setEditForm({ name: student.name, email: student.email, password: '' })
                                                            setEditMessage('')
                                                            setShowEditModal(true)
                                                        }}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-all hover:shadow-sm"
                                                        onClick={() => handleDeleteStudent(student)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add Student Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative">
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl"></div>
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-purple-300/20 blur-2xl"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                                        <UserPlus className="h-6 w-6 text-indigo-500" />
                                        Add New Student
                                    </h2>
                                    <button onClick={() => setShowAddModal(false)} className="rounded-full p-1.5 hover:bg-slate-100 transition-colors">
                                        <X className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="add-name" className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                        <input
                                            id="add-name"
                                            type="text"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            placeholder="Student name"
                                            value={addForm.name}
                                            onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="add-email" className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                                        <input
                                            id="add-email"
                                            type="email"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            placeholder="student@email.com"
                                            value={addForm.email}
                                            onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="add-password" className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                                        <input
                                            id="add-password"
                                            type="password"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            placeholder="Min 6 characters"
                                            value={addForm.password}
                                            onChange={e => setAddForm({ ...addForm, password: e.target.value })}
                                        />
                                    </div>
                                    {addMessage && <div className={`text-sm text-center p-2 rounded-lg ${addMessage.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{addMessage}</div>}
                                    <div className="flex gap-3 pt-2">
                                        <button className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] transition-all" onClick={handleAddStudent}>Create Student</button>
                                        <button className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all" onClick={() => setShowAddModal(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Student Modal */}
                {showEditModal && selectedStudent && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative">
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl"></div>
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-orange-300/20 blur-2xl"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                                        <Pencil className="h-6 w-6 text-yellow-500" />
                                        Edit Student
                                    </h2>
                                    <button onClick={() => setShowEditModal(false)} className="rounded-full p-1.5 hover:bg-slate-100 transition-colors">
                                        <X className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                        <input
                                            id="edit-name"
                                            type="text"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-email" className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                                        <input
                                            id="edit-email"
                                            type="email"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            value={editForm.email}
                                            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-password" className="block text-sm font-medium text-slate-700 mb-1">New Password <span className="text-gray-400">(leave empty to keep current)</span></label>
                                        <input
                                            id="edit-password"
                                            type="password"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                            placeholder="Min 6 characters"
                                            value={editForm.password}
                                            onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                        />
                                    </div>
                                    {editMessage && <div className={`text-sm text-center p-2 rounded-lg ${editMessage.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{editMessage}</div>}
                                    <div className="flex gap-3 pt-2">
                                        <button className="flex-1 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-yellow-200 hover:shadow-lg hover:shadow-yellow-300 hover:scale-[1.02] transition-all" onClick={handleEditStudent}>Update Student</button>
                                        <button className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enroll Modal - بدون فیلدهای تاریخ */}
                {showEnrollModal && selectedStudent && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative">
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-300/20 blur-2xl"></div>
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-teal-300/20 blur-2xl"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                                        <BookOpen className="h-6 w-6 text-emerald-500" />
                                        Enroll {selectedStudent.name}
                                    </h2>
                                    <button onClick={() => setShowEnrollModal(false)} className="rounded-full p-1.5 hover:bg-slate-100 transition-colors">
                                        <X className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="enroll-class" className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                                        <select
                                            id="enroll-class"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                                            value={enrollForm.class_room_id}
                                            onChange={e => setEnrollForm({ ...enrollForm, class_room_id: e.target.value })}
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="enroll-teacher" className="block text-sm font-medium text-slate-700 mb-1">Teacher *</label>
                                        <select
                                            id="enroll-teacher"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                                            value={enrollForm.teacher_id}
                                            onChange={e => setEnrollForm({ ...enrollForm, teacher_id: e.target.value })}
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    {enrollMessage && <div className={`text-sm text-center p-2 rounded-lg ${enrollMessage.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{enrollMessage}</div>}
                                    <div className="flex gap-3 pt-2">
                                        <button className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 hover:scale-[1.02] transition-all" onClick={handleEnroll}>Enroll</button>
                                        <button className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all" onClick={() => setShowEnrollModal(false)}>Cancel</button>
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
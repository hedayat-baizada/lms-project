import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Plus, X, Trash2, Pencil } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Classes', href: '/admin/classes' },
];

interface ClassRoom {
    id: number;
    name: string;
    type: string;
    level: string | null;
    has_video: boolean;
    is_active: boolean;
    teacher_id: number | null;
    teacher?: { id: number; name: string };
}

interface Teacher {
    id: number;
    name: string;
    email: string;
}

export default function ClassesIndex() {
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');

    const [form, setForm] = useState({
        name: '',
        type: 'english',
        level: '',
        has_video: true,
        description: '',
        is_active: true,
        teacher_id: '',
    });

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        );
    }

    function loadData() {
        fetch('/api/classes', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => {
                setClasses(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }

    useEffect(() => {
        loadData();
        fetch('/api/admin/teachers', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => setTeachers(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    function handleCreateClass(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.teacher_id) {
            setMessage('Please select a teacher and enter a class name.');
            return;
        }

        fetch('/api/classes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
            body: JSON.stringify(form),
        })
            .then(r => r.json())
            .then(data => {
                if (data.id) {
                    setMessage('✅ Class created successfully!');
                    loadData();
                    setTimeout(() => {
                        setShowModal(false);
                        setMessage('');
                        setForm({ name: '', type: 'english', level: '', has_video: true, description: '', is_active: true, teacher_id: '' });
                    }, 1500);
                } else {
                    setMessage('❌ ' + (data.message ?? 'Error'));
                }
            })
            .catch(() => setMessage('❌ Network error'));
    }

    // 🗑️ DELETE FUNCTION
    function handleDeleteClass(classRoom: ClassRoom) {
        if (!confirm(`Are you sure you want to delete "${classRoom.name}"? This cannot be undone.`)) {
            return;
        }

        setDeleteMessage('Deleting...');

        fetch('/api/classes/' + classRoom.id, {
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
                        throw new Error(data.message || 'Error occurred');
                    });
                }
                return response.json();
            })
            .then(() => {
                setDeleteMessage('✅ Class deleted successfully!');
                loadData();
                setTimeout(() => setDeleteMessage(''), 2000);
            })
            .catch(error => {
                setDeleteMessage('❌ ' + error.message);
                setTimeout(() => setDeleteMessage(''), 3000);
            });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">

                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        All Classes
                    </h1>
                    <button
                        className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:scale-105 transition-all duration-200 ease-in-out"
                        onClick={() => {
                            setForm({ name: '', type: 'english', level: '', has_video: true, description: '', is_active: true, teacher_id: '' });
                            setMessage('');
                            setShowModal(true);
                        }}
                    >
                        + Add Class
                    </button>
                </div>

                {/* Delete Status Message */}
                {deleteMessage && (
                    <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
                        deleteMessage.includes('✅') 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : deleteMessage.includes('❌') 
                                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                        {deleteMessage}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* English Classes */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-700">
                                <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                                English Classes
                            </h2>
                            <div className="grid gap-5 md:grid-cols-3">
                                {classes
                                    .filter(c => c.type === 'english')
                                    .map(classRoom => (
                                        <div key={classRoom.id} className="group rounded-2xl bg-white shadow-lg shadow-slate-200/60 overflow-hidden hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300 ease-out">
                                            <div className="relative h-40 w-full bg-gradient-to-br from-indigo-400 to-purple-400">
                                                <img
                                                    src={`https://picsum.photos/seed/english-${classRoom.id}/600/300`}
                                                    alt={classRoom.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                                                    <div className="flex items-start justify-between">
                                                        <h3 className="text-white font-bold text-lg leading-tight drop-shadow">
                                                            {classRoom.name}
                                                        </h3>
                                                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md ${classRoom.is_active ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                                            {classRoom.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                    <p className="text-white/80 text-xs mt-1 drop-shadow">
                                                        {classRoom.type.charAt(0).toUpperCase() + classRoom.type.slice(1)} · {classRoom.level?.replace('_', '-') ?? 'No level'}
                                                        {classRoom.teacher && (
                                                            <span className="ml-2 text-white/60">👨‍🏫 {classRoom.teacher.name}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4 space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <span className="font-medium">Instructor:</span>
                                                    <span>{classRoom.teacher?.name || classRoom.level?.replace('_', ' ') || 'Staff'}</span>
                                                </div>

                                                <div className="flex items-center gap-1 text-amber-400 text-sm">
                                                    <span className="flex">★★★★★</span>
                                                    <span className="text-slate-500 text-xs ml-1">(4.5)</span>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                    {classRoom.has_video && (
                                                        <span className="inline-flex items-center gap-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-indigo-200">
                                                            📹 Video
                                                        </span>
                                                    )}
                                                    {classRoom.is_active && (
                                                        <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-amber-200">
                                                            ⭐ Bestseller
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                        Premium
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-2 transition-all"
                                                        onClick={() => router.visit(`/admin/classes/${classRoom.id}`)}
                                                    >
                                                        View Details →
                                                    </button>
                                                    <button
                                                        className="ml-auto p-1.5 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-all"
                                                        onClick={() => handleDeleteClass(classRoom)}
                                                        title="Delete Class"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Computer Classes */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-700">
                                <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                                Computer Classes
                            </h2>
                            <div className="grid gap-5 md:grid-cols-4">
                                {classes
                                    .filter(c => c.type === 'computer')
                                    .map(classRoom => (
                                        <div key={classRoom.id} className="group rounded-2xl bg-white shadow-lg shadow-slate-200/60 overflow-hidden hover:shadow-xl hover:shadow-emerald-200/50 hover:-translate-y-1 transition-all duration-300 ease-out">
                                            <div className="relative h-40 w-full bg-gradient-to-br from-emerald-400 to-teal-400">
                                                <img
                                                    src={`https://picsum.photos/seed/computer-${classRoom.id}/600/300`}
                                                    alt={classRoom.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                                                    <div className="flex items-start justify-between">
                                                        <h3 className="text-white font-bold text-lg leading-tight drop-shadow">
                                                            {classRoom.name}
                                                        </h3>
                                                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md ${classRoom.is_active ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                                            {classRoom.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                    <p className="text-white/80 text-xs mt-1 drop-shadow">
                                                        {classRoom.type.charAt(0).toUpperCase() + classRoom.type.slice(1)} · {classRoom.level?.replace('_', '-') ?? 'No level'}
                                                        {classRoom.teacher && (
                                                            <span className="ml-2 text-white/60">👨‍🏫 {classRoom.teacher.name}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4 space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <span className="font-medium">Instructor:</span>
                                                    <span>{classRoom.teacher?.name || classRoom.level?.replace('_', ' ') || 'Staff'}</span>
                                                </div>

                                                <div className="flex items-center gap-1 text-amber-400 text-sm">
                                                    <span className="flex">★★★★★</span>
                                                    <span className="text-slate-500 text-xs ml-1">(4.5)</span>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                    {classRoom.has_video && (
                                                        <span className="inline-flex items-center gap-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-indigo-200">
                                                            📹 Video
                                                        </span>
                                                    )}
                                                    {classRoom.is_active && (
                                                        <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-amber-200">
                                                            ⭐ Bestseller
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                        Premium
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-2 transition-all"
                                                        onClick={() => router.visit(`/admin/classes/${classRoom.id}`)}
                                                    >
                                                        View Details →
                                                    </button>
                                                    <button
                                                        className="ml-auto p-1.5 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-all"
                                                        onClick={() => handleDeleteClass(classRoom)}
                                                        title="Delete Class"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Modal for Add Class */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 relative max-h-[90vh] overflow-y-auto">
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl"></div>
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-purple-300/20 blur-2xl"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                                        <Plus className="h-6 w-6 text-indigo-500" />
                                        Add New Class
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="rounded-full p-1.5 hover:bg-slate-100 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateClass} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Class Name *</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            placeholder="e.g. A1 Class"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                                        <select
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            value={form.type}
                                            onChange={e => setForm({ ...form, type: e.target.value })}
                                            required
                                        >
                                            <option value="english">English</option>
                                            <option value="computer">Computer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                                        <select
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            value={form.level}
                                            onChange={e => setForm({ ...form, level: e.target.value })}
                                        >
                                            <option value="">No Level</option>
                                            <option value="prep_cel">Prep-CEL</option>
                                            <option value="cel">CEL</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Teacher *</label>
                                        <select
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            value={form.teacher_id}
                                            onChange={e => setForm({ ...form, teacher_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map(t => (
                                                <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea
                                            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                            rows={3}
                                            placeholder="Class description..."
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={form.has_video}
                                                onChange={e => setForm({ ...form, has_video: e.target.checked })}
                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Has Video
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={form.is_active}
                                                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Active
                                        </label>
                                    </div>

                                    {message && (
                                        <div className={`text-sm text-center p-2 rounded-lg ${message.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                            {message}
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="submit"
                                            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] transition-all"
                                        >
                                            Create Class
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
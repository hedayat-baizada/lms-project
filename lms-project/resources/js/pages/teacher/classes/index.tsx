import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type SharedData } from '@/types'
import { Head, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Classes', href: '/teacher/classes' },
]

interface ClassRoom {
    id: number
    name: string
    type: string
    level: string | null
    has_video: boolean
    is_active: boolean
    // اضافه شده برای اطلاعات معلم (اختیاری)
    teacher?: { id: number; name: string }
}

export default function TeacherClasses() {
    const { auth } = usePage<SharedData>().props
    const [classes, setClasses] = useState<ClassRoom[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // ✅ استفاده از API اصلی که برای معلم فیلتر شده است
        fetch('/api/classes', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'include',
        })
            .then((r) => {
                if (!r.ok) throw new Error('Failed to fetch classes')
                return r.json()
            })
            .then((data) => {
                setClasses(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error loading classes:', err)
                setError('Could not load your classes. Please try again.')
                setLoading(false)
            })
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Classes" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        My Classes
                    </h1>
                    <span className="text-sm text-slate-500 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50">
                        {loading ? 'Loading...' : `${classes.length} class${classes.length !== 1 ? 'es' : ''}`}
                    </span>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl bg-rose-50/80 backdrop-blur-sm border border-rose-200/50 p-6 text-center">
                        <p className="text-rose-700 font-medium">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-200 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && classes.length === 0 && (
                    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/60 p-12 text-center">
                        <svg className="h-12 w-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-slate-500 font-medium">No classes assigned yet.</p>
                        <p className="text-sm text-slate-400 mt-1">You will see your classes here once assigned.</p>
                    </div>
                )}

                {!loading && !error && classes.length > 0 && (
                    <>
                        {/* English Classes */}
                        {classes.filter(c => c.type === 'english').length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-700">
                                    <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                                    English Classes
                                </h2>
                                <div className="grid gap-5 md:grid-cols-3">
                                    {classes
                                        .filter(c => c.type === 'english')
                                        .map(classRoom => (
                                            <ClassCard key={classRoom.id} classRoom={classRoom} type="english" />
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Computer Classes */}
                        {classes.filter(c => c.type === 'computer').length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-700">
                                    <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                                    Computer Classes
                                </h2>
                                <div className="grid gap-5 md:grid-cols-4">
                                    {classes
                                        .filter(c => c.type === 'computer')
                                        .map(classRoom => (
                                            <ClassCard key={classRoom.id} classRoom={classRoom} type="computer" />
                                        ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    )
}

// کامپوننت کارت کلاس برای جلوگیری از تکرار کد
function ClassCard({ classRoom, type }: { classRoom: ClassRoom; type: 'english' | 'computer' }) {
    const gradient =
        type === 'english'
            ? 'from-indigo-400 to-purple-400'
            : 'from-emerald-400 to-teal-400'

    const buttonGradient =
        type === 'english'
            ? 'from-indigo-500 to-purple-500'
            : 'from-emerald-500 to-teal-500'

    return (
        <div className="group rounded-2xl bg-white shadow-lg shadow-slate-200/60 overflow-hidden hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 transition-all duration-300 ease-out">
            {/* Image header */}
            <div className={`relative h-40 w-full bg-gradient-to-br ${gradient}`}>
                <img
                    src={`https://picsum.photos/seed/${type}-${classRoom.id}/600/300`}
                    alt={classRoom.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
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

                <button
                    className={`mt-2 w-full rounded-lg bg-gradient-to-r ${buttonGradient} px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] transition-all duration-200`}
                    onClick={() => router.visit(`/teacher/classes/${classRoom.id}`)}
                >
                    View Students →
                </button>
            </div>
        </div>
    )
}
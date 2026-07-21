import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type SharedData } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface ResultData {
    student: { id: number; name: string; father_name: string }
    class: { id: number; name: string; teacher: string }
    class_incharge: string
    program_manager: string
    co_founder: string
    eligible_for: string
    awarded_on: string
    attendance: { present: number; total: number; percentage: number }
    final_percentage: number
    grade: string
    status: string
    academic_term?: string
}

export default function StudentResultShow() {
    const { props } = usePage<{ classId: number }>()
    const { classId } = props
    const { auth } = usePage<SharedData>().props
    const [result, setResult] = useState<ResultData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Classes', href: '/student/classes' },
        { title: 'Result', href: `/student/classes/${classId}/result` },
    ]

    useEffect(() => {
        if (!classId) return

        fetch(`/api/classes/${classId}/results/${auth.user.id}`, {
            headers: { 'Accept': 'application/json' },
            credentials: 'include',
        })
            .then(r => {
                if (!r.ok) throw new Error('Failed')
                return r.json()
            })
            .then(data => {
                setResult(data)
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [classId, auth.user.id])

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex justify-center items-center h-64">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            </AppLayout>
        )
    }

    if (error || !result) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="text-center text-red-600 p-6">Could not load result. Please try again.</div>
            </AppLayout>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Result Card" />

            <style>{`
                @media print {
                    nav, aside, header, .sidebar, .breadcrumbs, [role="navigation"] {
                        display: none !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .result-card-wrapper {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .result-card-print {
                        position: static !important;
                        margin: 0 auto !important;
                    }
                    .print-shadow-none {
                        box-shadow: none !important;
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .app-layout-header, .app-layout-sidebar, .app-layout-nav {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="max-w-[600px] mx-auto p-4 print:p-0 result-card-wrapper">
                <div className="bg-white shadow-lg border border-gray-300 overflow-hidden print:shadow-none print:border-0 relative result-card-print">

                    {/* Top Blue Bar with Dots */}
                    <div className="flex items-center justify-center bg-white">
                        <div className="flex-1 h-8 bg-[#1a3a6b]"></div>
                        <div className="px-4 py-2">
                            <div className="grid grid-cols-5 gap-1">
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <div key={i} className="w-1 h-1 bg-[#1a3a6b] rounded-full"></div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 h-8 bg-[#1a3a6b]"></div>
                    </div>

                    {/* Logo Section */}
                    <div className="py-6 px-4 text-center bg-white relative">
                        <div className="flex flex-col items-center justify-center">
                            <img 
                                src="/images/logo.png" 
                                alt="ALPHA Logo" 
                                className="h-40 md:h-40 object-contain"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                           
                        </div>
                    </div>

                    {/* Blue Banner */}
                    <div className="px-4 py-3 bg-[#1a3a6b] text-center mx-8 rounded-full mb-6">
                        <p className="text-white text-xs font-semibold tracking-wider uppercase">
                            A Cost-Free & Online School for Afghan Girls
                        </p>
                    </div>

                    {/* Title - RESULT CARD */}
                    <div className="py-4 text-center">
                        <h1 className="text-4xl font-bold text-[#1a3a6b] tracking-widest">RESULT CARD</h1>
                    </div>

                    {/* Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
                        <img 
                            src="/images/logo.png" 
                            alt="" 
                            className="w-96 h-96 object-contain"
                        />
                    </div>

                    {/* Student Information - CENTERED */}
                    <div className="px-10 py-6 space-y-4 relative z-10 text-center">
                        <div className="text-lg font-bold text-black">
                            Student ID: <span className="text-black">{String(result.student.id).padStart(4, '0')}</span>
                        </div>
                        <div className="text-lg font-bold text-black">
                            Full Name: <span className="text-black">{result.student.name}</span>
                        </div>
                        <div className="text-lg font-bold text-black">
                            Course Level: <span className="text-black">{result.class.name}</span>
                        </div>
                        <div className="text-lg font-bold text-black">
                            Marks (eg) : <span className="text-black">{result.final_percentage}%</span>
                        </div>
                        <div className="text-lg font-bold text-black">
                            Grade: <span className="text-black">{result.grade}</span>
                        </div>
                        <div className="text-lg font-bold text-black">
                            Academic Term: <span className="text-black">{result.academic_term || result.eligible_for}</span>
                        </div>
                    </div>

                    {/* Signatures Section */}
                    <div className="px-8 py-8 grid grid-cols-3 gap-4 items-end relative z-10">
                        {/* Academic Manager */}
                        <div className="text-center">
                            <div className="mb-2">
                                <img 
                                    src="/images/stamp_academic.png" 
                                    alt="Academic Manager Stamp" 
                                    className="h-16 mx-auto object-contain"
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                            </div>
                            <div className="border-2 border-gray-400 rounded-full px-3 py-1 inline-block">
                                <p className="text-xs font-semibold text-black">Academic Manager</p>
                            </div>
                            <p className="text-sm font-bold text-black mt-1">{result.program_manager || result.class_incharge}</p>
                        </div>

                        {/* Issue Date */}
                        <div className="text-center">
                            <div className="border-2 border-gray-400 rounded-full px-4 py-1 inline-block mb-1">
                                <p className="text-xs font-semibold text-black">Issue Date</p>
                            </div>
                            <p className="text-sm font-bold text-black">{result.awarded_on}</p>
                        </div>

                        {/* Co-Founder */}
                        <div className="text-center">
                            <div className="mb-2">
                                <img 
                                    src="/images/stamp_cofounder.png" 
                                    alt="Co-Founder Stamp" 
                                    className="h-16 mx-auto object-contain"
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                            </div>
                            <div className="border-2 border-gray-400 rounded-full px-4 py-1 inline-block">
                                <p className="text-xs font-semibold text-black">Co-Founder</p>
                            </div>
                            <p className="text-sm font-bold text-black mt-1">{result.co_founder}</p>
                        </div>
                    </div>

                    {/* Bottom Blue Bar with Dots */}
                    <div className="flex items-center justify-center bg-white mt-4">
                        <div className="flex-1 h-8 bg-[#1a3a6b]"></div>
                        <div className="px-4 py-2">
                            <div className="grid grid-cols-5 gap-1">
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <div key={i} className="w-1 h-1 bg-[#1a3a6b] rounded-full"></div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 h-8 bg-[#1a3a6b]"></div>
                    </div>
                </div>

                {/* Print Button */}
                <div className="mt-4 flex justify-center no-print">
                    <button
                        onClick={() => window.print()}
                        className="px-8 py-2.5 bg-[#1a3a6b] text-white rounded-lg hover:bg-[#0f2447] transition-colors shadow-md flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Result Card
                    </button>
                </div>
            </div>
        </AppLayout>
    )
}
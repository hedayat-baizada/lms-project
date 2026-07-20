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

            <div className="max-w-2xl mx-auto p-4 print:p-0">
                <style>{`
                    @media print {
                        body { background: white !important; }
                        .no-print { display: none !important; }
                        .print\\:shadow-none { box-shadow: none !important; }
                        .print\\:border-0 { border: 0 !important; }
                        .print\\:bg-white { background: white !important; }
                    }
                `}</style>

                <div className="bg-white shadow-lg border border-gray-300 overflow-hidden print:shadow-none print:border-0">

                    {/* Header – Both Logos */}
                    <div className="py-6 px-4 text-center border-b-2 border-gray-300 bg-white">
                        <div className="flex justify-center items-center gap-4 flex-wrap">
                            <img 
                                src="/images/logo.png" 
                                alt="ALPHA Logo" 
                                className="h-16 md:h-20 object-contain"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                            <img 
                                src="/images/logo_text.png" 
                                alt="ALPHA Educational Society" 
                                className="h-40 md:h-40 object-contain"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                        </div>
                    
                    </div>

                    {/* Title - RESULT CARD */}
                    <div className="py-2 text-center">
                        <h1 className="text-3xl font-bold text-blue-700 tracking-widest">RESULT CARD</h1>
                    </div>

                    {/* Student Information */}
                    <div className="px-8 py-4 space-y-1">
                        <div className="flex">
                            <span className="w-28 text-sm font-semibold text-gray-700">Name:</span>
                            <span className="text-sm text-gray-800">{result.student.name}</span>
                        </div>
                        <div className="flex">
                            <span className="w-28 text-sm font-semibold text-gray-700">F/Name:</span>
                            <span className="text-sm text-gray-800">{result.student.father_name}</span>
                        </div>
                        <div className="flex">
                            <span className="w-28 text-sm font-semibold text-gray-700">Class:</span>
                            <span className="text-sm text-gray-800">{result.class.name}</span>
                        </div>
                        <div className="flex">
                            <span className="w-28 text-sm font-semibold text-gray-700">Marks:</span>
                            <span className="text-sm text-gray-800">{result.final_percentage}%</span>
                        </div>
                        <div className="flex">
                            <span className="w-28 text-sm font-semibold text-gray-700">Grade:</span>
                            <span className={`text-sm font-bold ${result.status === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
                                {result.status === 'Passed' ? 'Pass' : 'Fail'}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="w-28 text-sm font-semibold text-gray-700">Eligible for:</span>
                            <span className="text-sm text-gray-800">{result.eligible_for}</span>
                        </div>
                        <div className="flex">
                            <span className="w-28 text-sm font-semibold text-gray-700">Awarded on:</span>
                            <span className="text-sm text-gray-800">{result.awarded_on}</span>
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="px-8 py-6 grid grid-cols-2 gap-8 border-t border-gray-200">
                        <div className="text-center">
                            <div className="border-t-2 border-gray-300 pt-1">
                                <p className="text-xs font-semibold text-gray-600 tracking-wider">CLASS INCHARGE</p>
                                <p className="text-sm text-gray-700">{result.class_incharge}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="border-t-2 border-gray-300 pt-1">
                                <p className="text-xs font-semibold text-gray-600 tracking-wider">PROGRAM MANAGER</p>
                                <p className="text-sm text-gray-700">{result.program_manager}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="py-4 px-6 text-center bg-gray-50 border-t border-gray-200">
                        <p className="text-xs text-gray-500">ALPHA Educational Society</p>
                        <p className="text-xs text-gray-400 italic">(A Free & Online Group for Afghan Girls)</p>
                        <div className="mt-2">
                            <p className="text-xs font-semibold text-gray-600 tracking-wider">CO-FOUNDER</p>
                            <p className="text-sm font-medium text-gray-700">{result.co_founder}</p>
                        </div>
                    </div>
                </div>

                {/* Print Button */}
                <div className="mt-4 flex justify-center no-print">
                    <button
                        onClick={() => window.print()}
                        className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
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
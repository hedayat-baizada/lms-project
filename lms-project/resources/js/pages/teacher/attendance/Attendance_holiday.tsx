
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Users, Mail, ChevronLeft, BookOpen, AlertCircle, User, Calendar } from 'lucide-react'
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    
]

export default function Attendance_holiday(){
    return(
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={"/"} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">
                </div>
        </AppLayout>
    )
};
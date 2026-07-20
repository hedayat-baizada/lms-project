
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Users, Mail, ChevronLeft, BookOpen, AlertCircle, User, Calendar } from 'lucide-react'
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    
]

export default function Attendance_setting(){
    return(
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={"/"} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900">
                    Attendance Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Configure attendance period, notification rules, and class
                    attendance preferences.
                </p>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">

                {/* Attendance Period */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Attendance Period
                    </label>

                    <select
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="7">Weekly (7 Days)</option>
                        <option value="14">Biweekly (14 Days)</option>
                        <option value="30">Monthly (30 Days)</option>
                    </select>
                </div>

                {/* Friday Off */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Friday Holiday
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-3">
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            defaultChecked
                        />

                        <div>
                            <p className="font-medium text-gray-800">
                                Friday is Official Holiday
                            </p>

                            <p className="text-sm text-gray-500">
                                Attendance cannot be taken on Fridays.
                            </p>
                        </div>
                    </label>
                </div>

                {/* Teacher Notification */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Notify Teacher After
                    </label>

                    <input
                        type="number"
                        min={1}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        defaultValue={2}
                    />

                    <p className="mt-2 text-xs text-gray-500">
                        Number of absences before notifying the teacher.
                    </p>
                </div>

                {/* Admin Notification */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Notify Admin After
                    </label>

                    <input
                        type="number"
                        min={1}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        defaultValue={3}
                    />

                    <p className="mt-2 text-xs text-gray-500">
                        Number of absences before notifying the administrator.
                    </p>
                </div>

                {/* Attendance Active */}
                <div className="lg:col-span-2">
                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 p-4">
                        <div>
                            <h3 className="font-medium text-gray-800">
                                Attendance Status
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Enable or disable attendance for this class.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            defaultChecked
                        />
                    </label>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-gray-200 px-6 py-4">
                <button
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    Save Settings
                </button>
            </div>
        </div>

            </div>
        </AppLayout>
    )
};
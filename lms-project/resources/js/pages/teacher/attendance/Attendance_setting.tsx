
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
            <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Attendance Settings</h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure attendance tracking rules and warning thresholds for this classroom.
          </p>
        </div>
        
        {/* Active Toggle (is_active) */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            // checked={formData.is_active}
            // onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-slate-700">
            {/* {formData.is_active ? 'Active' : 'Disabled'} */}
          </span>
        </label>
      </div>
{/* onSubmit={handleSubmit} */}
      <form  className="mt-6 space-y-6">
        
        {/* Target Classroom (class_rooms_id) */}
        <div>
          <label htmlFor="class_rooms_id" className="block text-sm font-medium text-slate-700 mb-1">
            Classroom
          </label>
          <select
            id="class_rooms_id"
            name="class_rooms_id"
            // value={formData.class_rooms_id}
            // onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          >
            <option value="1">Class 10-A (ID: 1)</option>
            <option value="2">Class 10-B (ID: 2)</option>
            <option value="3">Class 11-A (ID: 3)</option>
          </select>
        </div>

        {/* Attendance Period (period_days) */}
        <div>
          <label htmlFor="period_days" className="block text-sm font-medium text-slate-700 mb-1">
            Attendance Period Length
          </label>
          <select
            id="period_days"
            name="period_days"
            // value={formData.period_days}
            // onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          >
            <option value={7}>Weekly (7 Days)</option>
            <option value={14}>Biweekly (14 Days)</option>
            <option value={30}>Monthly (30 Days)</option>
          </select>
          <p className="text-xs text-slate-500 mt-1">
            Determines how frequently attendance summaries and cycles roll over.
          </p>
        </div>

        {/* Warning Thresholds Section */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Notification Thresholds</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Teacher Warning (teacher_warning_after) */}
            <div>
              <label htmlFor="teacher_warning_after" className="block text-xs font-medium text-slate-600 mb-1">
                Teacher Warning After (Days missed)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                id="teacher_warning_after"
                name="teacher_warning_after"
                // value={formData.teacher_warning_after}
                // onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            {/* Admin Warning (admin_warning_after) */}
            <div>
              <label htmlFor="admin_warning_after" className="block text-xs font-medium text-slate-600 mb-1">
                Admin Escalation After (Days missed)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                id="admin_warning_after"
                name="admin_warning_after"
                // value={formData.admin_warning_after}
                // onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Friday Off Setting (friday_off) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-800 block">Friday Off</span>
              <span className="text-xs text-slate-500">Automatically exclude Fridays from mandatory attendance tracking.</span>
            </div>
            <input
              type="checkbox"
              name="friday_off"
            //   checked={formData.friday_off}
            //   onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
          >
            Save Settings
          </button>
        </div>

      </form>
    </div>
    </div>

            </div>
        </AppLayout>
    )
};
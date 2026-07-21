
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Users, Mail, ChevronLeft, BookOpen, AlertCircle, User, Calendar } from 'lucide-react'
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    
]

export default function Attendance_period(){
    return(
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={"/"} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">
               <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200 font-sans">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Attendance Period Assignment</h2>
          <p className="text-sm text-slate-500 mt-1">
            Assign a teacher to a classroom for a specific date range and manage cycle lifecycle.
          </p>
        </div>
        {/* ${getStatusBadge(formData.status)}` */}
        {/* Visual Status Indicator */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border `}>
          {/* {formData.status} */}
        </span>
      </div>
{/* onSubmit={handleSubmit}  */}
      <form className="mt-6 space-y-6">
        
        {/* Foreign Keys Section (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Classroom Selection (class_rooms_id) */}
          <div>
            <label htmlFor="class_rooms_id" className="block text-sm font-medium text-slate-700 mb-1">
              Classroom
            </label>
            <select
              id="class_rooms_id"
              name="class_rooms_id"
            //   value={formData.class_rooms_id}
            //   onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              required
            >
              <option value="1">Room 101 — Grade 10-A</option>
              <option value="2">Room 102 — Grade 10-B</option>
              <option value="3">Lab 3 — Physics Advanced</option>
            </select>
          </div>

          {/* Teacher Selection (teacher_id) */}
          <div>
            <label htmlFor="teacher_id" className="block text-sm font-medium text-slate-700 mb-1">
              Assigned Teacher
            </label>
            <select
              id="teacher_id"
              name="teacher_id"
            //   value={formData.teacher_id}
            //   onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              required
            >
              <option value="10">Prof. Sarah Jenkins</option>
              <option value="12">Dr. Alan Turing</option>
              <option value="15">Ms. Maria Garcia</option>
            </select>
          </div>

        </div>

        {/* Date Pickers Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          
          {/* Start Date */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
            //   value={formData.start_date}
            //   onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-slate-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
            //   value={formData.end_date}
            //   onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              required
            />
          </div>

        </div>

        {/* Lifecycle Status Field (enum: draft, active, completed) */}
        <div className="pt-4 border-t border-slate-100">
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
            Lifecycle Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'draft', label: 'Draft', desc: 'Setup phase' },
              { id: 'active', label: 'Active', desc: 'Currently taking attendance' },
              { id: 'completed', label: 'Completed', desc: 'Archived / Term ended' }
            ].map((option) => (
              <label
                key={option.id}
                // className={`flex flex-col p-3 border rounded-lg cursor-pointer transition ${
                // //   formData.status === option.id
                //     // ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                //     // : 'border-slate-200 hover:bg-slate-50'
                // }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value={option.id}
                    // checked={formData.status === option.id}
                    // onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-800 capitalize">
                    {option.label}
                  </span>
                </div>
                <span className="text-xs text-slate-500 mt-1 pl-5">
                  {option.desc}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
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
            Save Assignment
          </button>
        </div>

      </form>
    </div>
               
               
                </div>
        </AppLayout>
    )
};
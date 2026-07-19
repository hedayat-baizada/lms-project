<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use App\Models\Attendance_record;
use Illuminate\Http\Request;

class AttendanceRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('teacher/attendance/Attendance_record');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance_record $attendance_record)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance_record $attendance_record)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance_record $attendance_record)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance_record $attendance_record)
    {
        //
    }
}

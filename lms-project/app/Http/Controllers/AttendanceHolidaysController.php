<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Attendance_Holidays;
use Illuminate\Http\Request;

class AttendanceHolidaysController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia::render('teacher/attendance/Attendance_holidays');
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
    public function show(Attendance_Holidays $attendance_Holidays)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance_Holidays $attendance_Holidays)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance_Holidays $attendance_Holidays)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance_Holidays $attendance_Holidays)
    {
        //
    }
}

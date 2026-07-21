<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Attendace_summary;
use Illuminate\Http\Request;

class AttendanceSummaryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('teacher/attendance/Attendance_summary');
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
    public function show(Attendace_summary $attendace_summary)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendace_summary $attendace_summary)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendace_summary $attendace_summary)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendace_summary $attendace_summary)
    {
        //
    }
}

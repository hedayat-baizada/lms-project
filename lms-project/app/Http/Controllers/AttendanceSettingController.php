<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\AttendanceSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AttendanceSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('teacher/attendance/Attendance_setting');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
            $teacherId = Auth::id();

            $classes = DB::table('teacher_class_assignments')
                ->join('class_rooms', 'teacher_class_assignments.class_room_id', '=', 'class_rooms.id')
                ->where('teacher_class_assignments.teacher_id', $teacherId)
                ->select(
                    'class_rooms.id',
                    'class_rooms.name'
                )
                ->orderBy('class_rooms.name')
                ->get();

            return Inertia::render('teacher/attendance/Attendance_setting', [
                'classes' => $classes,
            ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
          $request->validate([
        'class_room_id' => 'required|exists:class_rooms,id',
        'period_days' => 'required|integer',
        'official_off_day' => 'required|integer',
        'teacher_off_day' => 'nullable|integer',
        'full_marks' => 'required|numeric',
    ]);

    $exists = AttendanceSetting::where('class_room_id', $request->class_room_id)
        ->exists();

    if ($exists) {
        return back()->withErrors([
            'class_room_id' => 'Attendance settings already exist for this class.',
        ]);
    }

    AttendanceSetting::create([
        'class_room_id' => $request->class_room_id,
        'period_days' => $request->period_days,
        'official_off_day' => $request->official_off_day,
        'teacher_off_day' => $request->teacher_off_day,
        'full_marks' => $request->full_marks,
        'teacher_warning_after' => 2,
        'admin_warning_after' => 3,
    ]);

    return redirect()->route('attendance-settings.index')
        ->with('success', 'Attendance settings created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(AttendanceSetting $attendanceSetting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AttendanceSetting $attendanceSetting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AttendanceSetting $attendanceSetting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttendanceSetting $attendanceSetting)
    {
        //
    }
}

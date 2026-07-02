<?php

namespace App\Http\Controllers\Teacher;

use App\Models\TeacherDashbord;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherDashbordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('teacher-panel/TeacherDashboard');
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
    public function show(TeacherDashbord $teacherDashbord)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TeacherDashbord $teacherDashbord)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TeacherDashbord $teacherDashbord)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeacherDashbord $teacherDashbord)
    {
        //
    }
}

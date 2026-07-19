<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Class_Session;
use Illuminate\Http\Request;

class ClassSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia::render('teacher/attendance/Class_session');
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
    public function show(Class_Session $class_Session)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Class_Session $class_Session)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Class_Session $class_Session)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Class_Session $class_Session)
    {
        //
    }
}

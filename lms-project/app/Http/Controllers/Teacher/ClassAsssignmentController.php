<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ClassAsssignment;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ClassAsssignmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('teacher-panel/assignment/ClassAssignment');
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
    public function show(ClassAsssignment $classAsssignment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassAsssignment $classAsssignment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ClassAsssignment $classAsssignment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassAsssignment $classAsssignment)
    {
        //
    }
}

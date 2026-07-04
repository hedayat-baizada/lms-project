<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('Admin/Dashboard', [
            'roles' => $user->getRoleNames(),

            'stats' => [
                'users' => User::count(),

                // replace with real models later
                'students' => 250,
                'teachers' => 18,
                'volunteers' => 22,
                'applications' => 40,
                'courses' => 15,
                'programs' => 6,
                'attendance' => 94,
            ],
        ]);
    }
}
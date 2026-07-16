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
        $roles = $user->getRoleNames()->toArray();

        $stats = [
            'students'    => User::where('role', 'student')->count(),
            'teachers'    => User::where('role', 'teacher')->count(),
            'volunteers'  => 0,
            'applications'=> 0,
            'users'       => User::count(),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'roles' => $roles,
        ]);
    }
}
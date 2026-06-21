<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [

            'stats' => [
                'users' => User::count(),
                'activeUsers' => User::where('status', true)->count(),
                'roles' => Role::count(),
                'permissions' => Permission::count(),
            ],

            'recentUsers' => User::latest()
                ->take(5)
                ->get([
                    'id',
                    'name',
                    'email',
                    'created_at',
                ]),

        ]);
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:users.view', only: ['index', 'show']),
            new Middleware('permission:users.create', only: ['create', 'store']),
            new Middleware('permission:users.edit', only: ['edit', 'update']),
            new Middleware('permission:users.delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    
 public function index(Request $request)
{
    $query = User::with('roles');
    

    if ($request->search) {
        $query->where(function ($q) use ($request) {
            $q->where('name', 'like', "%{$request->search}%")
              ->orWhere('email', 'like', "%{$request->search}%")
              ->orWhere('phone', 'like', "%{$request->search}%");
        });
    }

    $users = $query
        ->orderBy('created_at', 'asc')
        ->paginate(10)
        ->withQueryString()
        ->through(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => (bool) $user->status,
                'email_verified_at' => $user->email_verified_at,
                'last_login_at' => $user->last_login_at,
                'created_at' => $user->created_at->toDateTimeString(),

                // Roles
                'roles' => $user->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                    ];
                }),
            ];
        });

    return Inertia::render('Admin/Users/Index', [
        'users' => $users,
        'filters' => $request->only('search'),
    ]);
}
    
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
{
    return Inertia::render('Admin/Users/Create', [
        'roles' => Role::orderBy('name')->get(),
    ]);
}

    /**
     * Store a newly created resource in storage.
     */public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'phone' => 'nullable|string|max:20',
        'roles' => 'required|array',
        'roles.*' => 'string|exists:roles,name',
        'status' => 'required|boolean',
        'password' => 'required|min:6|confirmed',
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'] ?? null,
        'status' => $validated['status'],
        'password' => Hash::make($validated['password']),
    ]);

    $user->syncRoles($validated['roles']);

    return redirect()
        ->route('users.index')
        ->with('success', 'User created successfully.');
}
    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
         return Inertia::render('Admin/Users/Show', [
        'user' => $user,
    ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
{
    return Inertia::render('Admin/Users/Edit', [
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'status' => (bool) $user->status,
            'roles' => $user->roles->pluck('name'),
        ],

        'roles' => Role::orderBy('name')->get(),
    ]);
}

    /**
     * Update the specified resource in storage.
     */

public function update(Request $request, User $user)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => [
            'required',
            'email',
            Rule::unique('users')->ignore($user->id),
        ],
        'phone' => 'nullable|string|max:20',
        'roles' => ['required', 'array'],
        'roles.*' => ['exists:roles,name'],
        'status' => 'required|boolean',
    ]);

    $user->update([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'],
        'status' => $validated['status'],
    ]);

    $user->syncRoles($validated['roles']);

    return redirect()
        ->route('users.index')
        ->with('success', 'User updated successfully.');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
       $user->delete();

    return redirect()->route('users.index');
    }
}

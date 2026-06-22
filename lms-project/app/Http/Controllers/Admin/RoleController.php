<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:roles.view', only: ['index', 'show']),
            new Middleware('permission:roles.create', only: ['create', 'store']),
            new Middleware('permission:roles.edit', only: ['edit', 'update']),
            new Middleware('permission:roles.delete', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
   public function index()
{
    $roles = Role::withCount('permissions')
        ->orderBy('created_at', 'asc')
        ->paginate(10);

    return Inertia::render('Admin/Roles/Index', [
        'roles' => $roles,
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Roles/Create', [
        'permissions' => Permission::all(),
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request,Role $role)
            {
                $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name',
                'permissions' => 'nullable|array',
            ]);

            $role = Role::create([
                'name' => $validated['name'],
            ]);

            if (!empty($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }

            return redirect()
                ->route('roles.index')
                ->with('success', 'Role created successfully.');
            }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        return Inertia::render('Admin/Roles/Show', [
    'role' => $role->load('permissions'),
]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
       return Inertia::render('Admin/Roles/Edit', [
        'role' => $role->load('permissions'),
        'permissions' => Permission::all(),
    ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
         $validated = $request->validate([
        'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
        'permissions' => 'nullable|array',
    ]);

    $role->update([
        'name' => $validated['name'],
    ]);

    $role->syncPermissions(
        $validated['permissions'] ?? []
    );

    return redirect()
        ->route('roles.index')
        ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
         $role->delete();

    return redirect()
        ->route('roles.index')
        ->with('success', 'Role deleted successfully.');
    }
}

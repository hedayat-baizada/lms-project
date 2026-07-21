<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AnnouncementController extends Controller
{
  public function index(Request $request)
{
    $query = Announcement::query();

    // Search
    if ($request->filled('search')) {
        $query->where(function ($q) use ($request) {
            $q->where('title', 'like', '%' . $request->search . '%')
              ->orWhere('message', 'like', '%' . $request->search . '%');
        });
    }

    // Audience Filter
    if ($request->filled('audience')) {
        $query->where('audience', $request->audience);
    }

    // Status Filter
    if ($request->filled('status')) {
        $query->where('is_active', $request->status);
    }

    $announcements = $query
        ->latest()
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('Admin/Announcements/Index', [
        'announcements' => $announcements,

        'filters' => [
            'search' => $request->search,
            'audience' => $request->audience,
            'status' => $request->status,
        ],

        'stats' => [
            'total' => Announcement::count(),
            'active' => Announcement::where('is_active', true)->count(),
            'inactive' => Announcement::where('is_active', false)->count(),
            'pinned' => Announcement::where('is_pinned', true)->count(),
        ],
    ]);
}
    public function create()
    {
        return Inertia::render('Admin/Announcements/Create');
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'message' => 'required|string',
        'audience' => 'required|in:all,students,teachers,volunteers',
        'is_pinned' => 'boolean',
        'is_active' => 'boolean',
        'publish_at' => 'nullable|date',
    ]);

    $validated['created_by'] = auth()->id();

    Announcement::create($validated);

    return redirect()
        ->route('announcements.index')
        ->with('success', 'Announcement created successfully.');
}

   public function edit(Announcement $announcement)
        {
            return Inertia::render('Admin/Announcements/Edit', [
                'announcement' => $announcement,
            ]);
        }

    public function update(Request $request, Announcement $announcement)
        {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'audience' => 'required|in:all,students,teachers,volunteers',
                'is_pinned' => 'boolean',
                'is_active' => 'boolean',
                'publish_at' => 'nullable|date',
            ]);

            $announcement->update($validated);

            return redirect()
                ->route('announcements.index')
                ->with('success', 'Announcement updated successfully.');
        }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return back();
    }

    public function togglePin(Announcement $announcement)
{
    $announcement->update([
        'is_pinned' => !$announcement->is_pinned,
    ]);

    return back();
}

public function toggleStatus(Announcement $announcement)
{
    $announcement->update([
        'is_active' => !$announcement->is_active,
    ]);

    return back();
}
}
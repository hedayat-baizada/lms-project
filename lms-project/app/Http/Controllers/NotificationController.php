<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use App\Models\User; // ✅ we need this

class NotificationController extends Controller
{
    private function getUser()
    {
        return User::find(1);
    }

    public function unreadCount()
    {
        $user = $this->getUser();
        return response()->json([
            'count' => $user->unreadNotifications->count()
        ]);
    }

    public function getDropdown()
    {
        $user = $this->getUser();
        $notifications = $user->notifications()->latest()->take(5)->get();
        return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        $user = $this->getUser();
        $notification = $user->notifications()->find($id);
        if ($notification) {
            $notification->markAsRead();
        }
        return response()->json(['status' => 'ok']);
    }

    public function markAllRead()
    {
        $user = $this->getUser();
        $user->unreadNotifications->markAsRead();
        return response()->json(['status' => 'ok']);
    }
}
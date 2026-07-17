import { useState, useEffect, useRef } from 'react'
import { Bell, Check, CheckCheck, X } from 'lucide-react'
import { router } from '@inertiajs/react'

interface Notification {
    id: string
    data: {
        title: string
        message: string
        type?: string
        [key: string]: any
    }
    read_at: string | null
    created_at: string
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // CSRF token from cookie (works with Laravel's VerifyCsrfToken)
    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
        )
    }

    // Load both unread count and the notifications list (separate calls)
    function loadNotifications() {
        // 1. Update the red badge count
        fetch('/notifications/unread-count', {
            headers: { 'Accept': 'application/json' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => {
                setUnreadCount(data.count || 0)
            })
            .catch(() => {})

        // 2. Fetch the latest notifications for the dropdown
        fetch('/notifications/dropdown', {
            headers: { 'Accept': 'application/json' },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(data => {
                setNotifications(data || [])
            })
            .catch(() => {})
    }

    useEffect(() => {
        loadNotifications()
        // Refresh every 30 seconds
        const interval = setInterval(loadNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Mark a single notification as read (POST)
    function markAsRead(notificationId: string) {
        fetch('/notifications/' + notificationId + '/read', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
        }).then(() => {
            loadNotifications()
        })
    }

    // Mark all as read (POST)
    function markAllAsRead() {
        fetch('/notifications/read-all', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrf(),
            },
            credentials: 'include',
        }).then(() => {
            loadNotifications()
        })
    }

    const formatDate = (date: string) => {
        const d = new Date(date)
        const now = new Date()
        const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
        if (diff < 60) return 'Just now'
        if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
        if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
        if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'
        return d.toLocaleDateString()
    }

    const getIcon = (type?: string) => {
        switch (type) {
            case 'class_started': return '📢'
            case 'homework_reviewed': return '📝'
            case 'exam_graded': return '📋'
            case 'lesson_released': return '🎬'
            default: return '🔔'
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                                <Bell className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const isRead = notif.read_at !== null
                                return (
                                    <div
                                        key={notif.id}
                                        className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
                                        onClick={() => markAsRead(notif.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl">{getIcon(notif.data?.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {notif.data?.title || 'Notification'}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    {notif.data?.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                                    {formatDate(notif.created_at)}
                                                </p>
                                            </div>
                                            {!isRead && (
                                                <span className="flex h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
import { useCan } from '@/lib/can';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Plus,
    Pencil,
    Trash2,
    Pin,
    Search,
    Megaphone,
    CheckCircle,
    XCircle,
} from 'lucide-react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Announcement {
    id: number;
    title: string;
    message: string;
    audience: string;
    is_pinned: boolean;
    is_active: boolean;
    publish_at: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    announcements: {
        data: Announcement[];
        links: PaginationLink[];
    };

    filters: {
        search?: string;
        audience?: string;
        status?: string;
    };

    stats: {
        total: number;
        active: number;
        inactive: number;
        pinned: number;
    };
}

const breadcrumbs = [
    {
        title: 'Announcements',
        href: '/announcements',
    },
];

export default function Index({
    announcements,
    filters,
    stats,
}: Props) {
    const can = useCan();

    const canCreate = can('announcements.create');
    const canEdit = can('announcements.edit');
    const canDelete = can('announcements.delete');
    const canManage = can('announcements.edit');

    const canViewStats =
        can('announcements.create') ||
        can('announcements.edit') ||
        can('announcements.delete');



    const [search, setSearch] = useState(filters.search ?? '');

    const [audience, setAudience] = useState(filters.audience ?? '');

    const [status, setStatus] = useState(filters.status ?? '');

    const filterAnnouncements = (
        searchValue = search,
        audienceValue = audience,
        statusValue = status
    ) => {

        router.get(
            route('announcements.index'),
            {
                search: searchValue,
                audience: audienceValue,
                status: statusValue,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcements" />

            <div className="space-y-6 p-6">

                {/* Header */}

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold">
                            School Announcements
                        </h1>

                        <p className="text-muted-foreground">
                            Manage announcements visible to students,
                            teachers and volunteers.
                        </p>

                    </div>

                    {canCreate && (
                        <Link href={route('announcements.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Announcement
                            </Button>
                        </Link>
                    )}

                </div>

                {/* Statistics */}

                {canViewStats && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                        <Card>

                            <CardContent className="flex items-center justify-between pt-6">

                                <div>

                                    <p className="text-sm text-muted-foreground">
                                        Total
                                    </p>

                                    <h2 className="text-3xl font-bold">
                                        {stats.total}
                                    </h2>

                                </div>

                                <Megaphone className="h-8 w-8 text-blue-600" />

                            </CardContent>

                        </Card>

                        <Card>

                            <CardContent className="flex items-center justify-between pt-6">

                                <div>

                                    <p className="text-sm text-muted-foreground">
                                        Active
                                    </p>

                                    <h2 className="text-3xl font-bold">
                                        {stats.active}
                                    </h2>

                                </div>

                                <CheckCircle className="h-8 w-8 text-green-600" />

                            </CardContent>

                        </Card>

                        <Card>

                            <CardContent className="flex items-center justify-between pt-6">

                                <div>

                                    <p className="text-sm text-muted-foreground">
                                        Pinned
                                    </p>

                                    <h2 className="text-3xl font-bold">
                                        {stats.pinned}
                                    </h2>

                                </div>

                                <Pin className="h-8 w-8 text-orange-500" />

                            </CardContent>

                        </Card>

                        <Card>

                            <CardContent className="flex items-center justify-between pt-6">

                                <div>

                                    <p className="text-sm text-muted-foreground">
                                        Inactive
                                    </p>

                                    <h2 className="text-3xl font-bold">
                                        {stats.inactive}
                                    </h2>

                                </div>

                                <XCircle className="h-8 w-8 text-red-600" />

                            </CardContent>

                        </Card>

                    </div>
                )}

                {/* Filters */}
                {canViewStats && (
                    <Card>

                        <CardContent className="pt-6">

                            <div className="grid gap-4 md:grid-cols-3">

                                <div className="relative">

                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                                    <Input
                                        className="pl-10"
                                        placeholder="Search announcement..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);

                                            filterAnnouncements(
                                                e.target.value,
                                                audience,
                                                status
                                            );
                                        }}
                                    />

                                </div>

                                <select
                                    className="h-10 rounded-md border px-3"
                                    value={audience}
                                    onChange={(e) => {

                                        setAudience(e.target.value);

                                        filterAnnouncements(
                                            search,
                                            e.target.value,
                                            status
                                        );

                                    }}
                                >

                                    <option value="">
                                        All Audience
                                    </option>

                                    <option value="all">
                                        Everyone
                                    </option>

                                    <option value="students">
                                        Students
                                    </option>

                                    <option value="teachers">
                                        Teachers
                                    </option>

                                    <option value="volunteers">
                                        Volunteers
                                    </option>

                                </select>

                                <select
                                    className="h-10 rounded-md border px-3"
                                    value={status}
                                    onChange={(e) => {

                                        setStatus(e.target.value);

                                        filterAnnouncements(
                                            search,
                                            audience,
                                            e.target.value
                                        );

                                    }}
                                >

                                    <option value="">
                                        All Status
                                    </option>

                                    <option value="1">
                                        Active
                                    </option>

                                    <option value="0">
                                        Inactive
                                    </option>

                                </select>

                            </div>

                        </CardContent>

                    </Card>

                )}
                {/* Announcement List */}

                {announcements.data.length === 0 ? (

                    <Card>

                        <CardContent className="py-20">

                            <div className="text-center">

                                <Megaphone className="mx-auto h-16 w-16 text-gray-400" />

                                <h2 className="mt-4 text-2xl font-semibold">
                                    No Announcements Found
                                </h2>

                                <p className="mt-2 text-muted-foreground">
                                    There are no announcements matching your filters.
                                </p>

                                {canCreate && (
                                    <Link
                                        href={route('announcements.create')}
                                        className="mt-6 inline-block"
                                    >
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Announcement
                                        </Button>
                                    </Link>
                                )}

                            </div>

                        </CardContent>

                    </Card>

                ) : (

                    <div className="space-y-5">

                        {announcements.data.map((announcement) => (

                            <Card
                                key={announcement.id}
                                className="transition hover:shadow-lg"
                            >

                                <CardHeader>

                                    <div className="flex items-start justify-between">

                                        <div className="space-y-3 flex-1">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <CardTitle className="text-xl">

                                                    {announcement.title}

                                                </CardTitle>

                                                {announcement.is_pinned && (

                                                    <Badge>

                                                        📌 Pinned

                                                    </Badge>

                                                )}

                                                {announcement.is_active ? (

                                                    <Badge className="bg-green-600">

                                                        Active

                                                    </Badge>

                                                ) : (

                                                    <Badge variant="destructive">

                                                        Inactive

                                                    </Badge>

                                                )}

                                                <Badge variant="secondary">

                                                    {announcement.audience}

                                                </Badge>

                                            </div>

                                            <CardDescription className="text-sm leading-7">

                                                {announcement.message}

                                            </CardDescription>

                                        </div>

                                        {/* Action Buttons */}

                                        <div className="flex gap-2">

                                            {canManage && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        router.patch(
                                                            route('announcements.pin', announcement.id)
                                                        )
                                                    }
                                                >
                                                    <Pin className="h-4 w-4" />
                                                </Button>
                                            )}

                                            {canManage && (
                                                <Button
                                                    variant={
                                                        announcement.is_active
                                                            ? "secondary"
                                                            : "default"
                                                    }
                                                    onClick={() =>
                                                        router.patch(
                                                            route('announcements.status', announcement.id)
                                                        )
                                                    }
                                                >
                                                    {announcement.is_active
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </Button>
                                            )}

                                            {canEdit && (
                                                <Link
                                                    href={route(
                                                        'announcements.edit',
                                                        announcement.id
                                                    )}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}

                                            {canDelete && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>

                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete Announcement?
                                                            </AlertDialogTitle>

                                                            <AlertDialogDescription>
                                                                This action cannot be undone.
                                                                The announcement will be permanently deleted.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>

                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>

                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    router.delete(
                                                                        route(
                                                                            "announcements.destroy",
                                                                            announcement.id
                                                                        )
                                                                    )
                                                                }
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}

                                        </div>

                                    </div>

                                </CardHeader>

                                <CardContent>

                                    <div className="flex justify-between items-center text-sm text-muted-foreground">

                                        <span>

                                            Published:

                                            {" "}

                                            {announcement.publish_at
                                                ? new Date(
                                                    announcement.publish_at
                                                ).toLocaleString()
                                                : "Immediately"}

                                        </span>

                                        <span>

                                            Created:

                                            {" "}

                                            {new Date(
                                                announcement.created_at
                                            ).toLocaleDateString()}

                                        </span>

                                    </div>

                                </CardContent>

                            </Card>

                        ))}

                    </div>

                )}
                {/* Pagination */}

                {announcements.links.length > 3 && (

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">

                        {announcements.links.map((link, index) => (

                            <Button
                                key={index}
                                variant={
                                    link.active
                                        ? "default"
                                        : "outline"
                                }
                                disabled={!link.url}
                                onClick={() => {

                                    if (link.url) {

                                        router.visit(link.url);

                                    }

                                }}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />

                        ))}

                    </div>

                )}

            </div>

        </AppLayout>

    );

}
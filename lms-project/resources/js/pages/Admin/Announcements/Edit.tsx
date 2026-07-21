import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const breadcrumbs = [
    {
        title: 'Announcements',
        href: '/announcements',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface Announcement {
    id: number;
    title: string;
    message: string;
    audience: string;
    is_pinned: boolean;
    is_active: boolean;
    publish_at: string | null;
}

interface Props {
    announcement: Announcement;
}

export default function Edit({ announcement }: Props) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        title: announcement.title ?? '',
        message: announcement.message ?? '',
        audience: announcement.audience ?? 'all',
        is_pinned: announcement.is_pinned,
        is_active: announcement.is_active,
        publish_at: announcement.publish_at
            ? announcement.publish_at.slice(0, 16)
            : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('announcements.update', announcement.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Announcement" />

            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Announcement</CardTitle>
                        <CardDescription>
                            Update announcement information.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">

                            {/* Title */}
                            <div>
                                <Label htmlFor="title">Title</Label>

                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                />

                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Audience */}
                            <div>
                                <Label htmlFor="audience">Audience</Label>

                                <select
                                    id="audience"
                                    className="w-full rounded-md border h-10 px-3"
                                    value={data.audience}
                                    onChange={(e) =>
                                        setData('audience', e.target.value)
                                    }
                                >
                                    <option value="all">All Users</option>
                                    <option value="students">Students</option>
                                    <option value="teachers">Teachers</option>
                                    <option value="volunteers">Volunteers</option>
                                </select>

                                {errors.audience && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.audience}
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <Label htmlFor="message">Message</Label>

                                <Textarea
                                    id="message"
                                    rows={8}
                                    value={data.message}
                                    onChange={(e) =>
                                        setData('message', e.target.value)
                                    }
                                />

                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            {/* Publish Date */}
                            <div>
                                <Label htmlFor="publish_at">Publish Date</Label>

                                <Input
                                    id="publish_at"
                                    type="datetime-local"
                                    value={data.publish_at}
                                    onChange={(e) =>
                                        setData('publish_at', e.target.value)
                                    }
                                />
                            </div>

                            {/* Checkboxes */}
                            <div className="flex gap-8">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={data.is_pinned}
                                        onCheckedChange={(checked) =>
                                            setData('is_pinned', checked === true)
                                        }
                                    />
                                    <Label>Pin Announcement</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData('is_active', checked === true)
                                        }
                                    />
                                    <Label>Active</Label>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <Link href={route('announcements.index')}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                </Link>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Update Announcement
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
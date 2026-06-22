import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';



type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    email_verified_at: string | null;
    status: boolean;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    user: User;
};

export default function Show({ user }: Props) {

    return (
        <AppLayout>
            <Head title="User Details" />

            <div className="p-6 max-w-2xl mx-auto">

                <div className="bg-white border rounded-lg p-6 space-y-4">

                    <h1 className="text-2xl font-bold">
                        {user.name}
                    </h1>

                    <div className="space-y-2 text-sm">

                        <p><b>ID:</b> {user.id}</p>
                        <p><b>Email:</b> {user.email}</p>
                        <p><b>Phone:</b> {user.phone ?? '-'}</p>

                        <p>
                            <b>Email Verified:</b>{' '}
                            {user.email_verified_at ? (
                                <span className="text-green-600">Verified</span>
                            ) : (
                                <span className="text-red-500">Not Verified</span>
                            )}
                        </p>

                        <p>
                            <b>Status:</b>{' '}
                            {user.status ? (
                                <span className="text-green-600">Active</span>
                            ) : (
                                <span className="text-red-500">Inactive</span>
                            )}
                        </p>

                        <p><b>Last Login:</b> {user.last_login_at ?? 'Never'}</p>
                        <p><b>Created:</b> {user.created_at}</p>
                        <p><b>Updated:</b> {user.updated_at}</p>

                    </div>

                    <div className="flex gap-2 pt-4">

                        <Link
                            href={route('users.edit', user.id)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded text-sm"
                        >
                            Edit
                        </Link>

                        <Link
                            href={route('users.index')}
                            className="bg-gray-600 text-white px-4 py-2 rounded text-sm"
                        >
                            Back
                        </Link>

                    </div>

                </div>

            </div>
        </AppLayout>
    );
}
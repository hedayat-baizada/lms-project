import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Show({
    permission,
}: any) {
    return (
        <AppLayout>
            <Head title="Permission Details" />

            <div className="p-6">
                <h1 className="text-2xl font-bold">
                    Permission Details
                </h1>

                <div className="mt-4">
                    <strong>ID:</strong> {permission.id}
                </div>

                <div className="mt-2">
                    <strong>Name:</strong> {permission.name}
                </div>
            </div>
        </AppLayout>
    );
}
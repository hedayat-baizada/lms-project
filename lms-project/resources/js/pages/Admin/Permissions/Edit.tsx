import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({
    permission,
}: any) {
    const { data, setData, put, processing, errors } =
        useForm({
            name: permission.name,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(
            route('permissions.update', permission.id)
        );
    };

    return (
        <AppLayout>
            <Head title="Edit Permission" />

            <form
                onSubmit={submit}
                className="max-w-lg p-6"
            >
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) =>
                        setData('name', e.target.value)
                    }
                    className="border p-2 w-full"
                />

                {errors.name && (
                    <div className="text-red-500">
                        {errors.name}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white"
                >
                    Update
                </button>
            </form>
        </AppLayout>
    );
}
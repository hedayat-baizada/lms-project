import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } =
        useForm({
            name: '',
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('permissions.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Permission" />

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
                    placeholder="Permission Name"
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
                    Save
                </button>
            </form>
        </AppLayout>
    );
}
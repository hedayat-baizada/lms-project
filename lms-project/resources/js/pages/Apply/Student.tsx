import { useForm, usePage } from '@inertiajs/react';
import PublicApplicationLayout from '@/layouts/public-application-layout';

export default function StudentApplication() {
    const { flash } = usePage().props as {
        flash?: {
            message?: string;
        };
    };

    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        father_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post('/apply/student/personal-info');
    }

    return (
         <PublicApplicationLayout>
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="mx-auto max-w-2xl bg-white p-8 rounded shadow">
                <div className="mb-8 border-b border-slate-200 pb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    Student Admission
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Personal Information
                </h1>

                <p className="mt-2 text-slate-600">
                    Please provide accurate information before continuing to the next
                    step.
                </p>
            </div>

                {flash?.message && (
                    <div className="mb-4 rounded bg-blue-100 p-3 text-blue-700">
                        {flash.message}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Full Name</label>
                        <input
                            required
                            maxLength={100}
                            className="w-full border rounded p-2"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                        />
                        {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Father Name</label>
                        <input
                            required
                            maxLength={100}
                            className="w-full border rounded p-2"
                            value={data.father_name}
                            onChange={(e) => setData('father_name', e.target.value)}
                        />
                        {errors.father_name && <p className="mt-1 text-sm text-red-600">{errors.father_name}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            className="w-full border rounded p-2"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Phone</label>
                        <input
                            inputMode="tel"
                            maxLength={20}
                            className="w-full border rounded p-2"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full border rounded p-2"
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                        />
                        {errors.date_of_birth && <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Gender</label>
                        <select
                            className="w-full border rounded p-2"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Address</label>
                        <textarea
                            rows={4}
                            maxLength={500}
                            className="w-full border rounded p-2"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-3 rounded"
                    >
                        {processing ? 'Saving...' : 'Save and Continue'}
                    </button>
                </form>
            </div>
        </div>
        </PublicApplicationLayout>
    );
}
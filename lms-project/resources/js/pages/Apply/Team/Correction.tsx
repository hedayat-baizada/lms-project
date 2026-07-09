import { useForm } from '@inertiajs/react';

type Props = {
    application: any;
    latestCorrectionRequest: any;
};

export default function TeamCorrection({
    application,
    latestCorrectionRequest,
}: Props) {
    const form = useForm({
        correction_note: '',
        photo: null as File | null,
        cv: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        form.post(`/apply/team/${application.id}/correction`, {
            forceFormData: true,
        });
    }

    return (
        <div className="min-h-screen bg-slate-100 py-10">
            <div className="mx-auto max-w-4xl space-y-8 px-5">

                <div className="rounded-3xl bg-gradient-to-r from-orange-600 to-red-600 p-8 text-white shadow-xl">
                    <h1 className="text-4xl font-bold">
                        Correction Requested
                    </h1>

                    <p className="mt-3">
                        The reviewer has requested some changes before your
                        application can continue.
                    </p>
                </div>

                <div className="rounded-3xl border bg-white p-6 shadow">
                    <h2 className="text-2xl font-bold">
                        Reviewer's Message
                    </h2>

                    <div className="mt-5 rounded-2xl bg-orange-50 p-5">
                        {latestCorrectionRequest?.message}
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-8 rounded-3xl border bg-white p-6 shadow"
                >
                    <div>
                        <label className="mb-2 block font-semibold">
                            Explain what you corrected
                        </label>

                        <textarea
                            rows={6}
                            value={form.data.correction_note}
                            onChange={(e) =>
                                form.setData(
                                    'correction_note',
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border p-4"
                        />

                        {form.errors.correction_note && (
                            <p className="mt-2 text-sm text-red-600">
                                {form.errors.correction_note}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block font-semibold">
                            Replace Photo (optional)
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                form.setData(
                                    'photo',
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />

                        {form.errors.photo && (
                            <p className="mt-2 text-sm text-red-600">
                                {form.errors.photo}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block font-semibold">
                            Replace CV (optional)
                        </label>

                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                                form.setData(
                                    'cv',
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />

                        {form.errors.cv && (
                            <p className="mt-2 text-sm text-red-600">
                                {form.errors.cv}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        Submit Correction
                    </button>
                </form>
            </div>
        </div>
    );
}
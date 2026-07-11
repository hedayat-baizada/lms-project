import { useForm } from '@inertiajs/react';

type Props = {
    application: any;
    latestCorrectionRequest: any;
    replaceableDocuments: {
        id: number;
        document_type: string;
        document_owner_type: string;
    }[];
};

export default function Correction({
    application,
    latestCorrectionRequest,
    replaceableDocuments,
}: Props) {



    const form = useForm({
        correction_message: '',
        replacement_document_type: '',
        correction_file: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        form.post(`/apply/student/${application.id}/correction`, {
            forceFormData: true,
        });
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="rounded-3xl bg-orange-600 p-8 text-white shadow-xl">
                    <h1 className="text-4xl font-bold">
                        Submit Application Correction
                    </h1>

                    <p className="mt-3 text-orange-100">
                        Please provide the requested correction below.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow">
                    <h2 className="text-2xl font-bold">
                        Reviewer Request
                    </h2>

                    <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-orange-900">
                        {latestCorrectionRequest?.message ?? 'Correction requested.'}
                    </div>
                </div>

                <form onSubmit={submit} className="rounded-3xl bg-white p-8 shadow">
                    <div>
                        <label className="mb-2 block font-semibold">
                            Your Correction / Explanation
                        </label>

                        <textarea
                            rows={6}
                            className="w-full rounded-xl border px-4 py-3"
                            value={form.data.correction_message}
                            onChange={(e) =>
                                form.setData('correction_message', e.target.value)
                            }
                            placeholder="Example: I uploaded a clearer ID card, or my correct address is..."
                        />

                        {form.errors.correction_message && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.correction_message}
                            </p>
                        )}
                    </div>

                    <div className="mt-6">
                        <label className="mb-2 block font-semibold">
                            Upload File if Needed
                        </label>

                        <div>
    <label className="mb-2 block font-semibold">
        Document You Are Replacing
    </label>

    <select
        value={form.data.replacement_document_type}
        onChange={(e) =>
            form.setData(
                'replacement_document_type',
                e.target.value
            )
        }
        className="w-full rounded-xl border px-4 py-3"
    >
        <option value="">
            Select a document
        </option>

        {replaceableDocuments.map((document) => (
            <option
                key={document.id}
                value={document.document_type}
            >
                {formatDocumentType(document.document_type)}
                {' — '}
                {formatDocumentType(
                    document.document_owner_type
                )}
            </option>
        ))}
    </select>

    {form.errors.replacement_document_type && (
        <p className="mt-2 text-sm text-red-600">
            {form.errors.replacement_document_type}
        </p>
    )}
</div>

                        <input
                            type="file"
                            className="w-full rounded-xl border bg-white px-4 py-3"
                            onChange={(e) =>
                                form.setData(
                                    'correction_file',
                                    e.target.files?.[0] ?? null
                                )
                            }
                        />

                        {form.errors.correction_file && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.correction_file}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="mt-8 w-full rounded-xl bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700 disabled:bg-gray-400"
                    >
                        {form.processing ? 'Submitting...' : 'Submit Correction'}
                    </button>
                </form>
            </div>
        </div>
    );
}



function formatDocumentType(value: string) {
    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (character) =>
            character.toUpperCase()
        );
}
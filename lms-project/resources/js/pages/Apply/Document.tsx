import { useForm, usePage } from '@inertiajs/react';

type PageProps = {
    application: {
        id: number;
        full_name: string;
        email: string;
    };
};

export default function DocumentStep() {
    const { application } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        document_option: '',
        document_number: '',
        document_name: '',
        document_file: null as File | null,

        guardian_full_name: '',
        guardian_relationship: '',
        guardian_phone: '',
        guardian_document_type: '',
        guardian_document_number: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(`/apply/student/${application.id}/document`, {
            forceFormData: true,
        });
    }

    const isGuardian = data.document_option === 'no_own_document';
    const isOther = data.document_option === 'other';

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="mx-auto max-w-2xl bg-white p-8 rounded shadow">
                <h1 className="text-3xl font-bold mb-2">
                    Identity Verification
                </h1>

                <p className="mb-6 text-gray-600">
                    Applicant: {application.full_name}
                </p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block mb-1">
                            Which identity document do you have?
                        </label>

                        <select
                            className="w-full border rounded p-2"
                            value={data.document_option}
                            onChange={(e) => setData('document_option', e.target.value)}
                        >
                            <option value="">Select document</option>
                            <option value="tazkira">Afghan Tazkira / Afghan ID</option>
                            <option value="unhcr">UNHCR Card</option>
                            <option value="por">POR Card</option>
                            <option value="other">Other Document</option>
                            <option value="no_own_document">I do not have my own document</option>
                        </select>

                        {errors.document_option && (
                            <p className="text-red-600">{errors.document_option}</p>
                        )}
                    </div>

                    {isOther && (
                        <div>
                            <label className="block mb-1">Document Name</label>
                            <input
                                className="w-full border rounded p-2"
                                value={data.document_name}
                                onChange={(e) => setData('document_name', e.target.value)}
                            />
                        </div>
                    )}

                    {!isGuardian && data.document_option && (
                        <>
                            <div>
                                <label className="block mb-1">Document Number</label>
                                <input
                                    className="w-full border rounded p-2"
                                    value={data.document_number}
                                    onChange={(e) => setData('document_number', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block mb-1">Upload Document</label>
                                <input
                                    type="file"
                                    className="w-full border rounded p-2"
                                    onChange={(e) =>
                                        setData('document_file', e.target.files?.[0] ?? null)
                                    }
                                />
                                {errors.document_file && (
                                    <p className="text-red-600">{errors.document_file}</p>
                                )}
                            </div>
                        </>
                    )}

                    {isGuardian && (
                        <>
                            <div>
                                <label className="block mb-1">Guardian Full Name</label>
                                <input
                                    className="w-full border rounded p-2"
                                    value={data.guardian_full_name}
                                    onChange={(e) => setData('guardian_full_name', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block mb-1">Guardian Relationship</label>
                                <input
                                    className="w-full border rounded p-2"
                                    value={data.guardian_relationship}
                                    onChange={(e) => setData('guardian_relationship', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block mb-1">Guardian Phone</label>
                                <input
                                    className="w-full border rounded p-2"
                                    value={data.guardian_phone}
                                    onChange={(e) => setData('guardian_phone', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block mb-1">Guardian Document Type</label>
                                <select
                                    className="w-full border rounded p-2"
                                    value={data.guardian_document_type}
                                    onChange={(e) => setData('guardian_document_type', e.target.value)}
                                >
                                    <option value="">Select document</option>
                                    <option value="tazkira">Afghan Tazkira</option>
                                    <option value="unhcr">UNHCR Card</option>
                                    <option value="por">POR Card</option>
                                    <option value="other">Other Document</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1">Guardian Document Number</label>
                                <input
                                    className="w-full border rounded p-2"
                                    value={data.guardian_document_number}
                                    onChange={(e) =>
                                        setData('guardian_document_number', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className="block mb-1">Upload Guardian Document</label>
                                <input
                                    type="file"
                                    className="w-full border rounded p-2"
                                    onChange={(e) =>
                                        setData('document_file', e.target.files?.[0] ?? null)
                                    }
                                />
                            </div>
                        </>
                    )}

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
    );
}
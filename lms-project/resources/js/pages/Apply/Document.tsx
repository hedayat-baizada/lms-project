import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type PageProps = {
    application: {
        id: number;
        full_name: string;
        email: string;
    };
};

export default function DocumentStep() {
    const [preview, setPreview] = useState<string | null>(null);

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

    const isGuardian = data.document_option === 'no_own_document';
    const isOther = data.document_option === 'other';

    useEffect(() => {
        setPreview(null);
        setData('document_file', null);
    }, [data.document_option]);

    function handleFileChange(file: File | null) {
        setData('document_file', file);

        if (file && file.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(`/apply/student/${application.id}/document`, {
            forceFormData: true,
        });
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="mx-auto max-w-2xl rounded bg-white p-8 shadow">
                <h1 className="mb-2 text-3xl font-bold">
                    Identity Verification
                </h1>

                <p className="mb-6 text-gray-600">
                    Applicant: {application.full_name}
                </p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="mb-1 block">
                            Which identity document do you have?
                        </label>

                        <select
                            className="w-full rounded border p-2"
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
                            <p className="mt-1 text-sm text-red-600">
                                {errors.document_option}
                            </p>
                        )}
                    </div>

                    {isOther && (
                        <div>
                            <label className="mb-1 block">Document Name</label>
                            <input
                                className="w-full rounded border p-2"
                                value={data.document_name}
                                onChange={(e) => setData('document_name', e.target.value)}
                            />
                        </div>
                    )}

                    {!isGuardian && data.document_option && (
                        <>
                            <div>
                                <label className="mb-1 block">Document Number</label>
                                <input
                                    className="w-full rounded border p-2"
                                    value={data.document_number}
                                    onChange={(e) => setData('document_number', e.target.value)}
                                />
                            </div>

                            <FileUploadPreview
                                label="Upload Document"
                                preview={preview}
                                error={errors.document_file}
                                onChange={handleFileChange}
                            />
                        </>
                    )}

                    {isGuardian && (
                        <>
                            <div>
                                <label className="mb-1 block">Guardian Full Name</label>
                                <input
                                    className="w-full rounded border p-2"
                                    value={data.guardian_full_name}
                                    onChange={(e) => setData('guardian_full_name', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block">Guardian Relationship</label>
                                <input
                                    className="w-full rounded border p-2"
                                    value={data.guardian_relationship}
                                    onChange={(e) => setData('guardian_relationship', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block">Guardian Phone</label>
                                <input
                                    className="w-full rounded border p-2"
                                    value={data.guardian_phone}
                                    onChange={(e) => setData('guardian_phone', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block">Guardian Document Type</label>
                                <select
                                    className="w-full rounded border p-2"
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
                                <label className="mb-1 block">Guardian Document Number</label>
                                <input
                                    className="w-full rounded border p-2"
                                    value={data.guardian_document_number}
                                    onChange={(e) => setData('guardian_document_number', e.target.value)}
                                />
                            </div>

                            <FileUploadPreview
                                label="Upload Guardian Document"
                                preview={preview}
                                error={errors.document_file}
                                onChange={handleFileChange}
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded bg-blue-600 py-3 text-white"
                    >
                        {processing ? 'Saving...' : 'Save and Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function FileUploadPreview({
    label,
    preview,
    error,
    onChange,
}: {
    label: string;
    preview: string | null;
    error?: string;
    onChange: (file: File | null) => void;
}) {
    return (
        <div>
            <label className="mb-1 block">{label}</label>

            <input
                type="file"
                accept="image/*,.pdf"
                className="w-full rounded border p-2"
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}

            {preview && (
                <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-gray-600">
                        Selected image preview
                    </p>

                    <img
                        src={preview}
                        alt="Selected document preview"
                        className="h-36 w-36 rounded-xl border object-cover"
                    />
                </div>
            )}
        </div>
    );
}
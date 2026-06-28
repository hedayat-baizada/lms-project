import { useForm } from '@inertiajs/react';

type Props = {
    application: any;
};

export default function ReviewApplication({ application }: Props) {
    const form = useForm({
        confirm: false,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.data.confirm) {
            alert('Please confirm that your information is correct.');
            return;
        }

        form.post(`/apply/student/${application.id}/review/submit`);
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="mx-auto max-w-4xl space-y-6 rounded-xl bg-white p-8 shadow">
                <div>
                    <h1 className="text-3xl font-bold">Review Your Application</h1>
                    <p className="mt-2 text-gray-600">
                        Please check your information before final submission.
                    </p>
                </div>

                <section className="rounded-lg border p-5">
                    <h2 className="mb-3 text-xl font-semibold">Personal Information</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                        <p><strong>Name:</strong> {application.full_name}</p>
                        <p><strong>Father Name:</strong> {application.father_name}</p>
                        <p><strong>Email:</strong> {application.email}</p>
                        <p><strong>Phone:</strong> {application.phone}</p>
                        <p><strong>Date of Birth:</strong> {application.date_of_birth}</p>
                        <p><strong>Gender:</strong> {application.gender}</p>
                        <p className="md:col-span-2"><strong>Address:</strong> {application.address}</p>
                    </div>
                </section>

                <section className="rounded-lg border p-5">
                    <h2 className="mb-3 text-xl font-semibold">Course Information</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                        <p><strong>Category:</strong> {application.course_category ?? '-'}</p>
                        <p><strong>Track:</strong> {application.course_track ?? '-'}</p>
                        <p><strong>Computer Topic:</strong> {application.selected_computer_topic ?? '-'}</p>
                        <p><strong>Test Required:</strong> {application.test_required ? 'Yes' : 'No'}</p>
                    </div>
                </section>

                <section className="rounded-lg border p-5">
                    <h2 className="mb-3 text-xl font-semibold">Documents</h2>

                    {application.documents?.length === 0 && (
                        <p className="text-gray-500">No document uploaded.</p>
                    )}

                    {application.documents?.map((document: any) => (
                        <div key={document.id} className="rounded border p-3">
                            <p><strong>Owner:</strong> {document.document_owner_type}</p>
                            <p><strong>Type:</strong> {document.document_type}</p>
                            <p><strong>Number:</strong> {document.document_number ?? '-'}</p>
                        </div>
                    ))}
                </section>

                <section className="rounded-lg border p-5">
                    <h2 className="mb-3 text-xl font-semibold">Test Status</h2>

                    {application.test_required ? (
                        <p>
                            <strong>Placement Test:</strong>{' '}
                            {application.placement_test?.status === 'submitted'
                                ? 'Completed'
                                : 'Not completed'}
                        </p>
                    ) : (
                        <p>No placement test required for this course.</p>
                    )}
                </section>

                <form onSubmit={submit} className="space-y-4 rounded-lg border p-5">
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={form.data.confirm}
                            onChange={(e) => form.setData('confirm', e.target.checked)}
                            className="mt-1"
                        />
                        <span>
                            I confirm that the information I provided is correct and complete.
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                    >
                        {form.processing ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
}
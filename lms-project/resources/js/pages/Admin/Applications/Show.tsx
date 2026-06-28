import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import {  useForm } from '@inertiajs/react';

type Props = {
    application: any;
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-lg border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">{title}</h2>
            {children}
        </section>
    );
}

export default function ApplicationShow({ application }: Props) {
    const scoreForm = useForm({
    written_score: application.placement_test?.written_score ?? '',
    speaking_score: application.placement_test?.speaking_score ?? '',
    reviewer_notes: application.placement_test?.reviewer_notes ?? '',
});
const decisionForm = useForm({
    notes: '',
    message: '',
});

function submitScore(e: React.FormEvent) {
    e.preventDefault();
    scoreForm.post(`/applications/${application.id}/score`, {
        preserveScroll: true,
    });
}
    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <div>
                    <Link href="/applications" className="text-blue-600 hover:underline">
                        ← Back to Applications
                    </Link>

                    <h1 className="mt-4 text-2xl font-bold">
                        Application Details
                    </h1>

                    <p className="text-gray-600">
                        Tracking Code: {application.tracking_code ?? '-'}
                    </p>

                    <span className="mt-2 inline-block rounded bg-gray-100 px-3 py-1 text-sm">
                        Status: {application.status}
                    </span>
                </div>

                <Card title="Applicant Information">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <p><strong>Full Name:</strong> {application.full_name}</p>
                        <p><strong>Father Name:</strong> {application.father_name}</p>
                        <p><strong>Email:</strong> {application.email}</p>
                        <p><strong>Phone:</strong> {application.phone}</p>
                        <p><strong>Date of Birth:</strong> {application.date_of_birth}</p>
                        <p><strong>Gender:</strong> {application.gender}</p>
                        <p className="md:col-span-2"><strong>Address:</strong> {application.address}</p>
                    </div>
                </Card>

                <Card title="Course Selection">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <p><strong>Category:</strong> {application.course_category ?? '-'}</p>
                        <p><strong>Track:</strong> {application.course_track ?? '-'}</p>
                        <p><strong>Computer Topic:</strong> {application.selected_computer_topic ?? '-'}</p>
                        <p><strong>Test Required:</strong> {application.test_required ? 'Yes' : 'No'}</p>
                        <p><strong>Speaking Required:</strong> {application.speaking_required ? 'Yes' : 'No'}</p>
                    </div>
                </Card>

                <Card title="Uploaded Documents">
                    {application.documents?.length === 0 && (
                        <p className="text-gray-500">No documents uploaded.</p>
                    )}

                    <div className="space-y-4">
                        {application.documents?.map((document: any) => (
                            <div key={document.id} className="rounded border p-4">
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    <p><strong>Owner:</strong> {document.document_owner_type}</p>
                                    <p><strong>Type:</strong> {document.document_type}</p>
                                    <p><strong>Number:</strong> {document.document_number ?? '-'}</p>
                                    <p><strong>Status:</strong> {document.status}</p>
                                </div>

                                {document.file_url && (
                                    <div className="mt-3">
                                        <a
                                            href={document.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Open Uploaded Document
                                        </a>

                                        {document.file_url.match(/\.(jpg|jpeg|png|webp)$/i) && (
                                            <img
                                                src={document.file_url}
                                                alt="Uploaded document"
                                                className="mt-3 max-h-72 rounded border"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Placement Test">
                    {!application.placement_test && (
                        <p className="text-gray-500">No placement test found.</p>
                    )}

                    {application.placement_test && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <p><strong>Test Code:</strong> {application.placement_test.test_code}</p>
                                <p><strong>Status:</strong> {application.placement_test.status}</p>
                                <p><strong>Started:</strong> {application.placement_test.started_at}</p>
                                <p><strong>Submitted:</strong> {application.placement_test.submitted_at ?? '-'}</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="mb-2 font-semibold">Applicant Answers</h3>

                                {application.placement_test.answers?.length === 0 && (
                                    <p className="text-gray-500">No answers saved.</p>
                                )}

                                <div className="space-y-2">
                                    {application.placement_test.answers?.map((answer: any) => (
                                        <div key={answer.id} className="rounded border p-3">
                                            <p><strong>Question ID:</strong> {answer.question_id}</p>
                                            <p><strong>Answer:</strong> {answer.answer_text ?? '-'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                

                <Card title="Review History">
    <div className="space-y-4">
        <div>
            <h3 className="mb-2 font-semibold">Correction Requests</h3>

            {application.correction_requests?.length === 0 && (
                <p className="text-gray-500">No correction requests.</p>
            )}

            {application.correction_requests?.map((request: any) => (
                <div key={request.id} className="rounded border p-3">
                    <p><strong>Status:</strong> {request.status}</p>
                    <p><strong>Message:</strong> {request.message}</p>
                    <p className="text-sm text-gray-500">{request.created_at}</p>
                </div>
            ))}
        </div>

        <div>
            <h3 className="mb-2 font-semibold">Reviewer Actions</h3>

            {application.review_actions?.length === 0 && (
                <p className="text-gray-500">No reviewer actions yet.</p>
            )}

            {application.review_actions?.map((action: any) => (
                <div key={action.id} className="rounded border p-3">
                    <p><strong>Action:</strong> {action.action}</p>
                    <p><strong>Notes:</strong> {action.notes ?? '-'}</p>
                    <p className="text-sm text-gray-500">{action.created_at}</p>
                </div>
            ))}
        </div>
    </div>
</Card>




                <Card title="Reviewer Decision">
    <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submitScore} className="space-y-4 rounded-lg border bg-gray-50 p-5">
            <h3 className="text-lg font-semibold">Manual Scoring</h3>

            <div>
                <label className="mb-1 block text-sm font-medium">Written / MCQ Score</label>
                <input
                    type="number"
                    className="w-full rounded-lg border px-3 py-2"
                    value={scoreForm.data.written_score}
                    onChange={(e) => scoreForm.setData('written_score', e.target.value)}
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Speaking Score</label>
                <input
                    type="number"
                    className="w-full rounded-lg border px-3 py-2"
                    value={scoreForm.data.speaking_score}
                    onChange={(e) => scoreForm.setData('speaking_score', e.target.value)}
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Reviewer Notes</label>
                <textarea
                    className="w-full rounded-lg border px-3 py-2"
                    rows={4}
                    value={scoreForm.data.reviewer_notes}
                    onChange={(e) => scoreForm.setData('reviewer_notes', e.target.value)}
                />
            </div>

            <button
                type="submit"
                disabled={scoreForm.processing}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
                {scoreForm.processing ? 'Saving...' : 'Save Scores'}
            </button>
        </form>

        <div className="space-y-4 rounded-lg border bg-gray-50 p-5">
            <h3 className="text-lg font-semibold">Decision Actions</h3>

            <div>
                <label className="mb-1 block text-sm font-medium">Rejection Notes</label>
                <textarea
                    className="w-full rounded-lg border px-3 py-2"
                    rows={3}
                    value={decisionForm.data.notes}
                    onChange={(e) => decisionForm.setData('notes', e.target.value)}
                    placeholder="Write reason for rejection..."
                />
            </div>

            <button
                type="button"
                disabled={decisionForm.processing}
                onClick={() =>
                    decisionForm.post(`/applications/${application.id}/reject`, {
                        preserveScroll: true,
                    })
                }
                className="w-full rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
            >
                Reject Application
            </button>

            <div className="border-t pt-4">
                <label className="mb-1 block text-sm font-medium">Correction Message</label>
                <textarea
                    className="w-full rounded-lg border px-3 py-2"
                    rows={3}
                    value={decisionForm.data.message}
                    onChange={(e) => decisionForm.setData('message', e.target.value)}
                    placeholder="Explain what the applicant must correct..."
                />
            </div>

            <button
                type="button"
                disabled={decisionForm.processing}
                onClick={() =>
                    decisionForm.post(`/applications/${application.id}/request-correction`, {
                        preserveScroll: true,
                    })
                }
                className="w-full rounded-lg bg-yellow-500 px-4 py-2 font-medium text-white hover:bg-yellow-600"
            >
                Request Correction
            </button>
        </div>
    </div>
</Card>
            </div>
        </AppLayout>
    );
}
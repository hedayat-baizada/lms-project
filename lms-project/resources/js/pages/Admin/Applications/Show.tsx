import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useEffect, useState } from 'react';

type Props = {
    application: any;
    placementSummary: {
        total: number;
        correct: number;
        wrong: number;
        percentage: number;
    };
    placementLevels: {
        id: number;
        program: string;
        level_code: string;
        display_name: string;
    }[];
};

export default function ApplicationShow({ application, placementSummary, placementLevels = [], }: Props) {
    
    
    




    const scoreForm = useForm({
    written_score: application.placement_test?.written_score ?? '',
    speaking_score: application.placement_test?.speaking_score ?? '',
    placement_level: application.placement_test?.placement_level ?? '',
    reviewer_notes: application.placement_test?.reviewer_notes ?? '',
});

    const decisionForm = useForm({
        notes: '',
        message: '',
    });

    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [correctionModalOpen, setCorrectionModalOpen] = useState(false);

    const isApproved = application.status === 'approved';
    const isRejected = application.status === 'rejected';
    const isFinalDecision = isApproved || isRejected;



    useEffect(() => {
    if (window.location.hash) {
        const element = document.querySelector(window.location.hash);

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }
}, []);



    function submitScore(e: React.FormEvent) {
        e.preventDefault();

        scoreForm.post(`/applications/${application.id}/score`, {
            preserveScroll: true,
        });
    }




    
    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white shadow-xl">
                    <Link href="/applications" className="text-sm text-blue-200 hover:underline">
                        ← Back to Applications
                    </Link>

                    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
                                Application Review
                            </p>

                            <h1 className="mt-3 text-4xl font-bold">
                                {application.full_name ?? 'Applicant'}
                            </h1>

                            <p className="mt-2 text-blue-100">
                                {application.tracking_code ?? '-'}
                            </p>
                        </div>

                        <StatusBadge status={application.status} />
                    </div>
                </div>

                <Section title="Applicant Information">
                    <InfoGrid
                        items={[
                            ['Full Name', application.full_name],
                            ['Father Name', application.father_name],
                            ['Email', application.email],
                            ['Phone', application.phone],
                            ['Date of Birth', application.date_of_birth],
                            ['Gender', application.gender],
                            ['Address', application.address],
                        ]}
                    />
                </Section>

                <Section title="Course Selection">
                    <InfoGrid
                        items={[
                            ['Category', application.course_category],
                            ['Track', application.course_track],
                            ['Computer Topic', application.selected_computer_topic ?? '-'],
                            ['Test Required', application.test_required ? 'Yes' : 'No'],
                            ['Speaking Required', application.speaking_required ? 'Yes' : 'No'],
                        ]}
                    />
                </Section>

                

                <Section title="Uploaded Documents">
                    {application.documents?.length === 0 && (
                        <p className="text-gray-500">No documents uploaded.</p>
                    )}

                    <div className="grid gap-5 md:grid-cols-2">
                        {application.documents?.map((document: any) => (
                            <div key={document.id} className="rounded-2xl border bg-slate-50 p-5">
                                <InfoGrid
                                    items={[
                                        ['Owner', document.document_owner_type],
                                        ['Type', document.document_type],
                                        ['Number', document.document_number ?? '-'],
                                        ['Status', document.status],
                                    ]}
                                />

                                {document.file_url && (
                                    <div className="mt-4">
                                        <a
                                            href={document.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Open Uploaded Document
                                        </a>

                                        {document.file_url.match(/\.(jpg|jpeg|png|webp)$/i) && (
                                            <img
                                                src={document.file_url}
                                                alt="Uploaded document"
                                                className="mt-4 max-h-72 rounded-xl border bg-white object-contain"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

          <Section title="Placement Test">
    {!application.placement_test && (
        <p className="text-gray-500">No placement test found.</p>
    )}

    {application.placement_test && (
        <div className="space-y-5">
            <InfoGrid
                items={[
                    ['Test Code', application.placement_test.test_code],
                    ['Status', application.placement_test.status],
                    ['Started', application.placement_test.started_at],
                    ['Submitted', application.placement_test.submitted_at ?? '-'],
                ]}
            />

            <div className="grid gap-4 md:grid-cols-4">
                <MiniStat
                    label="Total Answers"
                    value={placementSummary.total}
                    color="blue"
                />

                <MiniStat
                    label="Correct"
                    value={placementSummary.correct}
                    color="green"
                />

                <MiniStat
                    label="Wrong"
                    value={placementSummary.wrong}
                    color="red"
                />

                <MiniStat
                    label="Score"
                    value={`${placementSummary.percentage}%`}
                    color="amber"
                />
            </div>

            <div className="rounded-2xl border bg-slate-50 p-5">
                <p className="font-semibold">
                    Overall MCQ Performance
                </p>

                <p className="mt-2 text-sm text-gray-600">
                    {placementSummary.percentage >= 90 &&
                        'Excellent performance.'}

                    {placementSummary.percentage >= 70 &&
                        placementSummary.percentage < 90 &&
                        'Good performance.'}

                    {placementSummary.percentage >= 50 &&
                        placementSummary.percentage < 70 &&
                        'Fair performance. Reviewer should inspect answers.'}

                    {placementSummary.percentage < 50 &&
                        'Needs improvement. Reviewer should carefully inspect answers.'}
                </p>
            </div>

            <Link
                href={`/applications/${application.id}/placement-test`}
                className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
                View Questions & Answers →
            </Link>
        </div>
    )}
</Section>



{application.course_track === 'cel' && (
    <div id="writing">
    <Section title="Writing Assessment">
        <InfoGrid
            items={[
                [
                    'Status',
                    application.placement_test?.writing_answer
                        ? 'Completed'
                        : 'Not completed',
                ],
                [
                    'Word Count',
                    application.placement_test?.writing_answer
                        ? application.placement_test.writing_answer
                              .trim()
                              .split(/\s+/)
                              .filter(Boolean).length
                        : 0,
                ],
            ]}
        />

        <Link
            href={`/applications/${application.id}/writing`}
            className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
            Review Writing →
        </Link>
    </Section>
    </div>



)}



{application.course_track === 'cel' && (
    <div id="speaking">
    <Section title="Speaking Assessment">
        <InfoGrid
            items={[
                [
    'Status',
    application.speaking_test?.status === 'skipped'
        ? 'Skipped by applicant'
        : application.speaking_test?.audio_path
            ? 'Completed'
            : 'Not completed',
],
                [
                    'Submitted',
                    application.speaking_test?.submitted_at ?? '-',
                ],
            ]}
        />

        <Link
            href={`/applications/${application.id}/speaking`}
            className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
            Review Speaking →
        </Link>
    </Section>
    </div>
)}
                <Section title="Review History">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <HistoryList
                            title="Correction Requests"
                            empty="No correction requests."
                            items={application.correction_requests}
                            render={(request: any) => (
                                <>
                                    <p><strong>Status:</strong> {request.status}</p>
                                    <p><strong>Message:</strong> {request.message}</p>
                                    <p className="mt-1 text-sm text-gray-500">{request.created_at}</p>
                                </>
                            )}
                        />

                        <HistoryList
                            title="Reviewer Actions"
                            empty="No reviewer actions yet."
                            items={application.review_actions}
                            render={(action: any) => (
                                <>
                                    <p><strong>Action:</strong> {action.action}</p>
                                    <p><strong>Notes:</strong> {action.notes ?? '-'}</p>
                                    <p className="mt-1 text-sm text-gray-500">{action.created_at}</p>
                                </>
                            )}
                        />
                    </div>
                </Section>

           <div id="assessment">
    <Section title="Assessment Evaluation">
    <div className="grid gap-6 lg:grid-cols-3">
        <MiniStat label="MCQ Score" value={`${placementSummary.percentage}%`} color="blue" />
        <MiniStat label="Correct Answers" value={placementSummary.correct} color="green" />
        <MiniStat label="Wrong Answers" value={placementSummary.wrong} color="red" />
    </div>

    <form onSubmit={submitScore} className="mt-6 space-y-5 rounded-2xl border bg-slate-50 p-6">
        <h3 className="text-xl font-bold">Manual Evaluation</h3>

        <div className="grid gap-5 md:grid-cols-2">
            <Input
                label="Writing / MCQ Score"
                type="number"
                value={scoreForm.data.written_score}
                onChange={(value) => scoreForm.setData('written_score', value)}
            />

            <Input
                label="Speaking Score"
                type="number"
                value={scoreForm.data.speaking_score}
                onChange={(value) => scoreForm.setData('speaking_score', value)}
            />
        </div>

        <div>
            <label className="mb-2 block text-sm font-medium">
                Overall Placement
            </label>

            <div className="grid gap-3 md:grid-cols-2">
                {(placementLevels ?? []).map((level) => {
                    const selected = scoreForm.data.placement_level === level.level_code;

                    return (
                        <label
                            key={level.id}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                                selected
                                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                                    : 'hover:border-gray-400'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                        selected
                                            ? 'border-blue-600 bg-blue-600'
                                            : 'border-gray-400 bg-white'
                                    }`}
                                >
                                    {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                                </span>

                                <span className="font-medium">{level.display_name}</span>
                            </div>

                            <input
                                type="radio"
                                name="placement_level"
                                className="hidden"
                                checked={selected}
                                onChange={() =>
                                    scoreForm.setData('placement_level', level.level_code)
                                }
                            />
                        </label>
                    );
                })}
            </div>
        </div>

        <Textarea
            label="Reviewer Notes"
            value={scoreForm.data.reviewer_notes}
            onChange={(value) => scoreForm.setData('reviewer_notes', value)}
            placeholder="Write evaluation notes..."
        />

        <button
            type="submit"
            disabled={scoreForm.processing || isFinalDecision}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
            {scoreForm.processing ? 'Saving Evaluation...' : 'Save Evaluation'}
        </button>
    </form>

    {!isFinalDecision && (
        <div className="mt-6 rounded-2xl border bg-white p-6">
            <h3 className="text-xl font-bold">Decision Actions</h3>

            <div className="mt-5 grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border bg-green-50 p-5">
                    <h4 className="font-semibold text-green-900">Approve Application</h4>

                    <p className="mt-2 text-sm text-green-700">
                        This will approve the applicant and make them ready for student creation by the academic team.
                    </p>

                    <button
                        type="button"
                        disabled={decisionForm.processing}
                        onClick={() => setApproveModalOpen(true)}
                        className="mt-4 w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
                    >
                        Approve Application
                    </button>
                </div>

                <div className="space-y-4 rounded-2xl border bg-red-50 p-5">
                    <Textarea
                        label="Rejection Notes"
                        value={decisionForm.data.notes}
                        onChange={(value) => decisionForm.setData('notes', value)}
                        placeholder="Write reason for rejection..."
                    />

                    <button
                        type="button"
                        disabled={decisionForm.processing}
                       onClick={() => {
                            if (!decisionForm.data.notes.trim()) {
                                alert('Please write a rejection reason first.');
                                return;
                            }

                            setRejectModalOpen(true);
                        }}
                                                className="w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-gray-400"
                    >
                        Reject Application
                    </button>
                </div>

                <div className="space-y-4 rounded-2xl border bg-yellow-50 p-5">
                    <Textarea
                        label="Correction Message"
                        value={decisionForm.data.message}
                        onChange={(value) => decisionForm.setData('message', value)}
                        placeholder="Explain what the applicant must correct..."
                    />

                    <button
                        type="button"
                        disabled={decisionForm.processing}
                        onClick={() => {
                        if (!decisionForm.data.message.trim()) {
                            alert('Please write a correction message first.');
                            return;
                        }

                        setCorrectionModalOpen(true);
                    }}
                                            className="w-full rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-white hover:bg-yellow-600 disabled:bg-gray-400"
                    >
                        Request Correction
                    </button>
                </div>
            </div>
        </div>
    )}

    {isFinalDecision && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
            <h3 className="text-2xl font-bold text-green-800">
                ✓ Final Admission Decision
            </h3>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="mt-1 font-semibold">{application.status}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Placement Level</p>
                    <p className="mt-1 font-semibold">
                        {application.placement_test?.placement_level ?? '-'}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Writing Score</p>
                    <p className="mt-1 font-semibold">
                        {application.placement_test?.written_score ?? '-'}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Speaking Score</p>
                    <p className="mt-1 font-semibold">
                        {application.placement_test?.speaking_score ?? '-'}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Reviewed At</p>
                    <p className="mt-1 font-semibold">
                        {application.reviewed_at
                            ? new Date(application.reviewed_at).toLocaleString()
                            : '-'}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Next Step</p>
                    <p className="mt-1 font-semibold text-green-700">
                        Ready for Student Creation
                    </p>
                </div>
            </div>
        </div>
    )}
</Section>
</div>
            </div>


            <ConfirmationModal
    open={approveModalOpen}
    title="Approve Application?"
    message={`Approve ${application.full_name} and mark the application as ready for student creation?`}
    confirmText="Approve Application"
    confirmColor="green"
    loading={decisionForm.processing}
    onCancel={() => setApproveModalOpen(false)}
    onConfirm={() => {
        decisionForm.post(`/applications/${application.id}/approve`, {
            preserveScroll: true,
            onSuccess: () => setApproveModalOpen(false),
        });
    }}
/>




<ConfirmationModal
    open={rejectModalOpen}
    title="Reject Application?"
    message={`Are you sure you want to reject ${application.full_name}? This decision will be recorded in the review history.`}
    confirmText="Reject Application"
    confirmColor="red"
    loading={decisionForm.processing}
    onCancel={() => setRejectModalOpen(false)}
    onConfirm={() => {
        decisionForm.post(`/applications/${application.id}/reject`, {
            preserveScroll: true,
            onSuccess: () => setRejectModalOpen(false),
            onError: () => setRejectModalOpen(false),
        });
    }}
/>





<ConfirmationModal
    open={correctionModalOpen}
    title="Send Correction Request?"
    message={`The applicant will be notified and asked to update the requested information before the review continues.`}
    confirmText="Send Request"
    confirmColor="yellow"
    loading={decisionForm.processing}
    onCancel={() => setCorrectionModalOpen(false)}
    onConfirm={() => {
        decisionForm.post(`/applications/${application.id}/request-correction`, {
            preserveScroll: true,
            onSuccess: () => setCorrectionModalOpen(false),
            onError: () => setCorrectionModalOpen(false),
        });
    }}
/>


        </AppLayout>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold text-slate-900">{title}</h2>
            {children}
        </section>
    );
}

function InfoGrid({ items }: { items: [string, any][] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {items.map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="mt-1 font-semibold text-slate-900">{value ?? '-'}</p>
                </div>
            ))}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        waiting_review: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        need_correction: 'bg-orange-100 text-orange-800',
        incomplete: 'bg-gray-100 text-gray-700',
    };

    return (
        <span className={`rounded-full px-4 py-2 font-semibold ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}>
            {status?.replaceAll('_', ' ') ?? '-'}
        </span>
    );
}

function Input({
    label,
    type,
    value,
    onChange,
}: {
    label: string;
    type: string;
    value: any;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <input
                type={type}
                className="w-full rounded-xl border px-4 py-3"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function Textarea({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: any;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <textarea
                rows={4}
                className="w-full rounded-xl border px-4 py-3"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function HistoryList({
    title,
    empty,
    items,
    render,
}: {
    title: string;
    empty: string;
    items: any[];
    render: (item: any) => React.ReactNode;
}) {
    return (
        <div>
            <h3 className="mb-3 font-semibold">{title}</h3>

            {items?.length === 0 && <p className="text-gray-500">{empty}</p>}

            <div className="space-y-3">
                {items?.map((item: any) => (
                    <div key={item.id} className="rounded-xl border bg-slate-50 p-4">
                        {render(item)}
                    </div>
                ))}
            </div>
        </div>
    );
}


function MiniStat({
    label,
    value,
    color,
}: {
    label: string;
    value: string | number;
    color: 'blue' | 'green' | 'red' | 'amber';
}) {
    const colors = {
        blue: 'border-blue-500 bg-blue-50 text-blue-900',
        green: 'border-green-500 bg-green-50 text-green-900',
        red: 'border-red-500 bg-red-50 text-red-900',
        amber: 'border-amber-500 bg-amber-50 text-amber-900',
    };

    return (
        <div className={`rounded-2xl border-l-4 p-5 ${colors[color]}`}>
            <p className="text-sm font-medium opacity-80">
                {label}
            </p>

            <p className="mt-2 text-3xl font-bold">
                {value}
            </p>
        </div>
    );
}
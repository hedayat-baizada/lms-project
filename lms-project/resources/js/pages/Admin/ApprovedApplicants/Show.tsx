import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

type Props = {
    application: any;
};

export default function ApprovedApplicantShow({ application }: Props) {

    const [showCreateModal, setShowCreateModal] = useState(false);

const [studentForm, setStudentForm] = useState({
    name: application.full_name || '',
    email: application.email || '',
    password: generatePassword(),
});

async function createStudent() {
    try {
        await axios.post('/api/admin/users', {
            name: studentForm.name,
            email: studentForm.email,
            password: studentForm.password,
            role: 'student',
        });

        alert('Student account created successfully.');

        setShowCreateModal(false);
    } catch (error: any) {
        alert(
            error?.response?.data?.message ||
                'Failed to create student.'
        );
    }
}
    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-green-800 to-emerald-700 p-8 text-white shadow-xl">
                    <Link
                        href="/approved-applicants"
                        className="text-sm text-green-100 hover:underline"
                    >
                        ← Back to Approved Applicants
                    </Link>

                    <h1 className="mt-6 text-4xl font-bold">
                        Student Creation Handoff
                    </h1>

                    <p className="mt-2 text-green-100">
                        {application.full_name} — {application.tracking_code}
                    </p>
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

                <Section title="Course & Placement">
                    <InfoGrid
                        items={[
                            ['Course Category', application.course_category],
                            ['Course Track', application.course_track],
                            ['Computer Topic', application.selected_computer_topic ?? '-'],
                            ['Assigned Level', application.placement_test?.placement_level ?? '-'],
                            ['Approved Date', application.reviewed_at ? new Date(application.reviewed_at).toLocaleString() : '-'],
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

                <Section title="Placement Summary">
                    <div className="grid gap-4 md:grid-cols-3">
                        <MiniStat
                            label="MCQ Score"
                            value={application.placement_test?.total_score ?? '-'}
                            color="blue"
                        />

                        <MiniStat
                            label="Writing"
                            value={application.placement_test?.writing_answer ? 'Submitted' : 'Not submitted'}
                            color="green"
                        />

                        <MiniStat
                            label="Speaking"
                            value={
                                application.speaking_test?.status === 'skipped'
                                    ? 'Skipped'
                                    : application.speaking_test?.audio_path
                                      ? 'Submitted'
                                      : 'Not submitted'
                            }
                            color="amber"
                        />
                    </div>
                </Section>

                <Section title="Academic Department Action">
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                        <h3 className="text-xl font-bold text-blue-900">
                            Ready for Student Creation
                        </h3>

                        <p className="mt-2 text-blue-800">
                            This applicant has been approved by Admissions. The Academic Department can now create the student account, assign the class, and send login details.
                        </p>

                       <button
                        type="button"
                        onClick={() => {
    setStudentForm({
        name: application.full_name,
        email: application.email,
        password: generatePassword(),
    });

    setShowCreateModal(true);
}}
                        className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                    >
                        Create Student
                    </button>

                        <p className="mt-3 text-sm text-blue-700">
                            This button is reserved for the Academic Management module.
                        </p>
                    </div>
                </Section>
            </div>

            {showCreateModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="mb-5 text-2xl font-bold">
                Create Student Account
            </h2>

            <div className="space-y-4">

                <input
                    value={studentForm.name}
                    onChange={(e) =>
                        setStudentForm({
                            ...studentForm,
                            name: e.target.value,
                        })
                    }
                    className="w-full rounded-xl border px-4 py-3"
                />

                <input
                    value={studentForm.email}
                    onChange={(e) =>
                        setStudentForm({
                            ...studentForm,
                            email: e.target.value,
                        })
                    }
                    className="w-full rounded-xl border px-4 py-3"
                />

                <input
                    value={studentForm.password}
                    onChange={(e) =>
                        setStudentForm({
                            ...studentForm,
                            password: e.target.value,
                        })
                    }
                    className="w-full rounded-xl border px-4 py-3"
                />

            </div>

            <div className="mt-6 flex justify-end gap-3">

                <button
                    onClick={() =>
                        setShowCreateModal(false)
                    }
                    className="rounded-xl border px-4 py-2"
                >
                    Cancel
                </button>

                <button
                    onClick={createStudent}
                    className="rounded-xl bg-green-600 px-5 py-2 text-white"
                >
                    Create Student
                </button>

            </div>

        </div>
    </div>
)}
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

function MiniStat({
    label,
    value,
    color,
}: {
    label: string;
    value: string | number;
    color: 'blue' | 'green' | 'amber';
}) {
    const colors = {
        blue: 'border-blue-500 bg-blue-50 text-blue-900',
        green: 'border-green-500 bg-green-50 text-green-900',
        amber: 'border-amber-500 bg-amber-50 text-amber-900',
    };

    return (
        <div className={`rounded-2xl border-l-4 p-5 ${colors[color]}`}>
            <p className="text-sm font-medium opacity-80">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
    );
}

function generatePassword(length = 10) {
    const chars =
        'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';

    let password = '';

    for (let i = 0; i < length; i++) {
        password += chars.charAt(
            Math.floor(Math.random() * chars.length),
        );
    }

    return password;
}





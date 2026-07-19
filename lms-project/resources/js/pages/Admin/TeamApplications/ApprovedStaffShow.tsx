import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

type Props = {
    application: any;
};

export default function ApprovedStaffShow({ application }: Props) {
    function formatRole() {
        if (application.application_type === 'volunteer_manager') {
            return 'Volunteer Manager / Coordinator';
        }

        if (application.application_type === 'volunteer_support') {
            return 'Volunteer Support Staff';
        }

        return 'Professional Staff';
    }

    return (
        <AppLayout>
            <div className="space-y-8 p-6">
                <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white shadow-xl">
                    <Link
                        href="/approved-staffs"
                        className="text-sm text-blue-100 hover:underline"
                    >
                        ← Back to Approved Staffs
                    </Link>

                    <h1 className="mt-6 text-4xl font-bold">
                        {formatRole()}
                    </h1>

                    <p className="mt-2 text-blue-100">
                        {application.full_name} — {application.tracking_code}
                    </p>
                </div>

                <Section title="Approval Summary">
                    <InfoGrid
                        items={[
                            ['Status', 'Approved'],
                            ['Role', formatRole()],
                            [
                                'Approved On',
                                application.approved_at
                                    ? new Date(
                                          application.approved_at
                                      ).toLocaleString()
                                    : '-',
                            ],
                            [
                                'Approved By',
                                application.approved_by_user?.name ?? '-',
                            ],
                        ]}
                    />
                </Section>

                <Section title="Personal Information">
                    <InfoGrid
                        items={[
                            ['Full Name', application.full_name],
                            ['Email', application.email],
                            ['WhatsApp', application.phone],
                            ['Mobile Number', application.mobile_number ?? '-'],
                            ['Gender', application.gender ?? '-'],
                            ['Date of Birth', application.date_of_birth ?? '-'],
                            ['Current Residence', application.address ?? '-'],
                            [
                                'Permanent Address',
                                application.permanent_address ?? '-',
                            ],
                        ]}
                    />
                </Section>

                <Section title="Education & Qualifications">
                    <InfoGrid
                        items={[
                            [
                                'Highest Qualification',
                                application.education_level ?? '-',
                            ],
                            [
                                'University / School',
                                application.university_school ?? '-',
                            ],
                            [
                                'Date of Graduation',
                                application.date_of_graduation ?? '-',
                            ],
                            [
                                'Position / Field',
                                application.field_of_study ?? '-',
                            ],
                        ]}
                    />
                </Section>

                <Section title="Role Information">
                    <InfoGrid
                        items={[
                            ['Experience', application.experience ?? '-'],
                            ['Skills', application.skills ?? '-'],
                            ['Availability', application.availability ?? '-'],
                            [
                                'Preferred Mode',
                                application.preferred_mode ?? '-',
                            ],
                        ]}
                    />
                </Section>

                <Section title="Biography">
                    <div className="rounded-2xl bg-slate-50 p-5 leading-8 text-slate-700">
                        {application.motivation ?? '-'}
                    </div>
                </Section>

                <Section title="Uploaded Documents">
                    {application.documents?.length === 0 ? (
                        <p className="text-gray-500">
                            No documents uploaded.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {application.documents?.map((document: any) => {
                                const isImage =
                                    document.file_url?.match(
                                        /\.(jpg|jpeg|png|webp)$/i
                                    );

                                return (
                                    <div
                                        key={document.id}
                                        className="rounded-2xl border bg-slate-50 p-5"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                                                {isImage ? '🖼️' : '📄'}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-slate-900">
                                                    {documentLabel(
                                                        document.document_type
                                                    )}
                                                </p>

                                                <p className="mt-1 truncate text-sm text-gray-500">
                                                    {document.file_path
                                                        ?.split('/')
                                                        .pop() ??
                                                        'Uploaded file'}
                                                </p>

                                                <a
                                                    href={document.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-3 inline-flex rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
                                                >
                                                    Open Document
                                                </a>
                                            </div>
                                        </div>

                                        {isImage && (
                                            <img
                                                src={document.file_url}
                                                alt="Uploaded document"
                                                className="mt-4 max-h-64 w-full rounded-xl border bg-white object-contain"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Section>

                <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
                    This page is read-only. No approval, rejection, correction,
                    or account-creation action is performed here.
                </div>
            </div>
        </AppLayout>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold text-slate-900">
                {title}
            </h2>

            {children}
        </section>
    );
}

function InfoGrid({ items }: { items: [string, any][] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {items.map(([label, value]) => (
                <div
                    key={label}
                    className="rounded-xl bg-slate-50 p-4"
                >
                    <p className="text-sm font-medium text-gray-500">
                        {label}
                    </p>

                    <p className="mt-1 whitespace-pre-wrap font-semibold text-slate-900">
                        {value ?? '-'}
                    </p>
                </div>
            ))}
        </div>
    );
}

function documentLabel(type: string) {
    switch (type) {
        case 'photo':
            return 'Photo';
        case 'cv':
            return 'Curriculum Vitae / CV';
        case 'photo_correction':
            return 'Corrected Photo';
        case 'cv_correction':
            return 'Corrected CV';
        default:
            return type.replaceAll('_', ' ');
    }
}
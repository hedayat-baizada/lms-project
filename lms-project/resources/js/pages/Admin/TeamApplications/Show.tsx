// import AppLayout from '@/layouts/app-layout';
// import { Link, useForm } from '@inertiajs/react';
// import { useState } from 'react';
// type Props = {
//     application: any;
// };

// export default function TeamApplicationShow({ application }: Props) {


//     const decisionForm = useForm({
//     notes: '',
//     message: '',
// });

// const [approveOpen, setApproveOpen] = useState(false);
// const [rejectOpen, setRejectOpen] = useState(false);
// const [correctionOpen, setCorrectionOpen] = useState(false);

// const isApproved = application.status === 'approved';
// const isRejected = application.status === 'rejected';
// const isNeedCorrection = application.status === 'need_correction';
// // const isCorrectionSubmitted = application.status === 'correction_submitted';

// const canMakeDecision = !isApproved && !isRejected && !isNeedCorrection;
//     function formatType() {
//         if (application.application_type === 'volunteer_teacher') {
//             return `Volunteer ${
//                 application.teacher_subject === 'english'
//                     ? 'English'
//                     : 'Computer'
//             } Teacher`;
//         }

//         return application.application_type
//             .replaceAll('_', ' ')
//             .replace(/\b\w/g, (char: string) => char.toUpperCase());
//     }

//     function statusBadge(status: string) {
//         switch (status) {
//             case 'waiting_review':
//                 return 'bg-yellow-100 text-yellow-800';
//             case 'approved':
//                 return 'bg-green-100 text-green-800';
//             case 'rejected':
//                 return 'bg-red-100 text-red-800';
//             case 'need_correction':
//                 return 'bg-orange-100 text-orange-800';
//             case 'correction_submitted':
//                 return 'bg-blue-100 text-blue-800';
//             default:
//                 return 'bg-gray-100 text-gray-700';
//         }
//     }

  

//    return (
//     <AppLayout>
//         <>
//             <div className="space-y-8 p-6">
//                 <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 p-8 text-white shadow-xl">
//                     <Link
//                         href="/team-applications"
//                         className="text-sm text-emerald-100 hover:underline"
//                     >
//                         ← Back to Team Applications
//                     </Link>

//                     <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//                         <div>
//                             <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">
//                                 Team Application Review
//                             </p>

//                             <h1 className="mt-3 text-4xl font-bold">
//                                 {formatType()}
//                             </h1>

//                             <p className="mt-2 text-emerald-100">
//                                 {application.full_name} — {application.tracking_code}
//                             </p>
//                         </div>

//                         <span
//                             className={`w-fit rounded-full px-4 py-2 font-bold ${statusBadge(
//                                 application.status
//                             )}`}
//                         >
//                             {application.status.replaceAll('_', ' ')}
//                         </span>
//                     </div>
//                 </div>

//                 <Section title="Quick Summary">
//                     <InfoGrid
//                         items={[
//                             ['Applicant', application.full_name],
//                             ['Role', formatType()],
//                             ['Email', application.email],
//                             ['WhatsApp', application.phone],
//                             ['Submitted', application.submitted_at ? new Date(application.submitted_at).toLocaleString() : '-'],
//                             ['Preferred Mode', application.preferred_mode ?? '-'],
//                         ]}
//                     />
//                 </Section>

//                 <Section title="Personal Information">
//                     <InfoGrid
//                         items={[
//                             ['Full Name', application.full_name],
//                             ['Father Name', application.father_name ?? '-'],
//                             ['Email', application.email],
//                             ['WhatsApp Number', application.phone],
//                             ['Mobile Number', application.mobile_number ?? '-'],
//                             ['Gender', application.gender ?? '-'],
//                             ['Date of Birth', application.date_of_birth ?? '-'],
//                             ['Current Residence', application.address],
//                             ['Permanent Address', application.permanent_address ?? '-'],
//                         ]}
//                     />
//                 </Section>

//                 <Section title="Education & Qualifications">
//                     <InfoGrid
//                         items={[
//                             ['Highest Qualification', application.education_level],
//                             ['University / School', application.university_school ?? '-'],
//                             ['Date of Graduation', application.date_of_graduation ?? '-'],
//                             ['English Qualification', application.language_qualification ?? '-'],
//                             ['Computer Qualification', application.computer_qualification ?? '-'],
//                             ['Qualification Completion Date', application.qualification_completion_date ?? '-'],
//                             ['Teaching Experience Years', application.teaching_experience_years ?? '-'],
//                             ['Computer Skills', application.computer_skills ?? '-'],
//                         ]}
//                     />
//                 </Section>

//                 <Section title="Role Information">
//                     <InfoGrid
//                         items={[
//                             ['Experience', application.experience ?? '-'],
//                             ['Skills', application.skills ?? '-'],
//                             ['Position / Field', application.field_of_study ?? '-'],
//                             ['Availability', application.availability ?? '-'],
//                         ]}
//                     />
//                 </Section>

//                 <Section title="Biography">
//                     <div className="rounded-2xl bg-slate-50 p-5 leading-8 text-slate-700">
//                         {application.motivation ?? '-'}
//                     </div>
//                 </Section>

//                 <Section title="Uploaded Documents">
//                     {application.documents?.length === 0 && (
//                         <p className="text-gray-500">No documents uploaded.</p>
//                     )}

//                     <div className="grid gap-5 md:grid-cols-2">
//                         {application.documents?.map((document: any) => (
//                             <div
//                                 key={document.id}
//                                 className="rounded-2xl border bg-slate-50 p-5"
//                             >
//                                 <p className="font-bold text-slate-900">
//                                     {document.document_type.toUpperCase()}
//                                 </p>

//                                 <p className="mt-1 text-sm text-gray-500">
//                                     Status: {document.status}
//                                 </p>

//                                 {document.file_url && (
//                                     <div className="mt-4">
//                                         <a
//                                             href={document.file_url}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="font-medium text-blue-600 hover:underline"
//                                         >
//                                             Open Document
//                                         </a>

//                                         {document.file_url.match(/\.(jpg|jpeg|png|webp)$/i) && (
//                                             <img
//                                                 src={document.file_url}
//                                                 alt="Uploaded document"
//                                                 className="mt-4 max-h-72 rounded-xl border bg-white object-contain"
//                                             />
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </Section>

//                 <Section title="Review History">
//                     <div className="space-y-4">
//                         {application.status_logs?.length === 0 && (
//                             <p className="text-gray-500">No review history yet.</p>
//                         )}

//                         {application.status_logs?.map((log: any) => (
//                             <div
//                                 key={log.id}
//                                 className="rounded-2xl border bg-slate-50 p-4"
//                             >
//                                 <p className="font-semibold">
//                                     {log.old_status ?? '-'} → {log.new_status}
//                                 </p>

//                                 <p className="mt-1 text-sm text-gray-600">
//                                     {log.notes ?? 'No notes.'}
//                                 </p>

//                                 <p className="mt-2 text-xs text-gray-400">
//                                     {new Date(log.created_at).toLocaleString()}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                 </Section>

//                <Section title="Reviewer Decision">
//     {isApproved && (
//         <DecisionNotice
//             color="green"
//             title="Application Approved"
//             message="This team application has been approved and is ready for the next onboarding step."
//             date={application.approved_at}
//         />
//     )}

//     {isRejected && (
//         <DecisionNotice
//             color="red"
//             title="Application Rejected"
//             message={application.reviewer_notes ?? 'This application has been rejected.'}
//             date={application.rejected_at}
//         />
//     )}

//     {isNeedCorrection && (
//         <DecisionNotice
//             color="orange"
//             title="Correction Requested"
//             message="A correction request has been sent. Waiting for the applicant to respond."
//             date={application.updated_at}
//         />
//     )}

//     {canMakeDecision && (
//         <div className="grid gap-6 lg:grid-cols-3">
//             <div className="rounded-2xl border bg-green-50 p-5">
//                 <h3 className="font-bold text-green-900">Approve Application</h3>

//                 <p className="mt-2 text-sm text-green-700">
//                     Approve this applicant for the next onboarding step.
//                 </p>

//                 <button
//                     type="button"
//                     disabled={decisionForm.processing}
//                     onClick={() => setApproveOpen(true)}
//                     className="mt-5 w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
//                 >
//                     Approve
//                 </button>
//             </div>

//             <div className="rounded-2xl border bg-red-50 p-5">
//                 <h3 className="font-bold text-red-900">Reject Application</h3>

//                 <Textarea
//                     label="Rejection Reason"
//                     value={decisionForm.data.notes}
//                     onChange={(value) => decisionForm.setData('notes', value)}
//                     placeholder="Write rejection reason..."
//                 />

//                 {decisionForm.errors.notes && (
//                     <p className="mt-2 text-sm text-red-600">
//                         {decisionForm.errors.notes}
//                     </p>
//                 )}

//                 <button
//                     type="button"
//                     disabled={decisionForm.processing}
//                     onClick={() => setRejectOpen(true)}
//                     className="mt-5 w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-gray-400"
//                 >
//                     Reject
//                 </button>
//             </div>

//             <div className="rounded-2xl border bg-orange-50 p-5">
//                 <h3 className="font-bold text-orange-900">Request Correction</h3>

//                 <Textarea
//                     label="Correction Message"
//                     value={decisionForm.data.message}
//                     onChange={(value) => decisionForm.setData('message', value)}
//                     placeholder="Explain what needs correction..."
//                 />

//                 {decisionForm.errors.message && (
//                     <p className="mt-2 text-sm text-red-600">
//                         {decisionForm.errors.message}
//                     </p>
//                 )}

//                 <button
//                     type="button"
//                     disabled={decisionForm.processing}
//                     onClick={() => setCorrectionOpen(true)}
//                     className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-gray-400"
//                 >
//                     Request Correction
//                 </button>
//             </div>
//         </div>
//     )}
// </Section>

// <ConfirmModal
//     open={approveOpen}
//     title="Approve Application?"
//     message="Are you sure you want to approve this team application?"
//     confirmText="Approve"
//     color="green"
//     onCancel={() => setApproveOpen(false)}
//     onConfirm={() => {
//         decisionForm.post(`/team-applications/${application.id}/approve`, {
//             preserveScroll: true,
//             onSuccess: () => setApproveOpen(false),
//         });
//     }}
// />

// <ConfirmModal
//     open={rejectOpen}
//     title="Reject Application?"
//     message="Are you sure you want to reject this team application?"
//     confirmText="Reject"
//     color="red"
//     onCancel={() => setRejectOpen(false)}
//     onConfirm={() => {
//         decisionForm.post(`/team-applications/${application.id}/reject`, {
//             preserveScroll: true,
//             onSuccess: () => setRejectOpen(false),
//         });
//     }}
// />

// <ConfirmModal
//     open={correctionOpen}
//     title="Request Correction?"
//     message="Are you sure you want to request correction from this applicant?"
//     confirmText="Send Request"
//     color="orange"
//     onCancel={() => setCorrectionOpen(false)}
//     onConfirm={() => {
//         decisionForm.post(`/team-applications/${application.id}/request-correction`, {
//             preserveScroll: true,
//             onSuccess: () => setCorrectionOpen(false),
//         });
//     }}
// />
//                         </div>
//         </>
//     </AppLayout>
// );
// }
// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//     return (
//         <section className="rounded-3xl border bg-white p-6 shadow-sm">
//             <h2 className="mb-5 text-2xl font-bold text-slate-900">{title}</h2>
//             {children}
//         </section>
//     );
// }

// function InfoGrid({ items }: { items: [string, any][] }) {
//     return (
//         <div className="grid gap-4 md:grid-cols-2">
//             {items.map(([label, value]) => (
//                 <div key={label} className="rounded-xl bg-slate-50 p-4">
//                     <p className="text-sm font-medium text-gray-500">{label}</p>
//                     <p className="mt-1 whitespace-pre-wrap font-semibold text-slate-900">
//                         {value ?? '-'}
//                     </p>
//                 </div>
//             ))}
//         </div>
//     );
// }


// function Textarea({
//     label,
//     value,
//     onChange,
//     placeholder,
// }: {
//     label: string;
//     value: string;
//     onChange: (value: string) => void;
//     placeholder?: string;
// }) {
//     return (
//         <div className="mt-4">
//             <label className="mb-1 block text-sm font-medium">{label}</label>

//             <textarea
//                 rows={4}
//                 value={value}
//                 placeholder={placeholder}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="w-full rounded-xl border px-4 py-3"
//             />
//         </div>
//     );
// }


// function DecisionNotice({
//     color,
//     title,
//     message,
//     date,
// }: {
//     color: 'green' | 'red' | 'orange';
//     title: string;
//     message: string;
//     date?: string | null;
// }) {
//     const colors = {
//         green: 'border-green-200 bg-green-50 text-green-900',
//         red: 'border-red-200 bg-red-50 text-red-900',
//         orange: 'border-orange-200 bg-orange-50 text-orange-900',
//     };

//     return (
//         <div className={`rounded-2xl border p-6 ${colors[color]}`}>
//             <h3 className="text-xl font-bold">{title}</h3>

//             <p className="mt-3">{message}</p>

//             {date && (
//                 <p className="mt-4 text-sm opacity-80">
//                     Date: {new Date(date).toLocaleString()}
//                 </p>
//             )}
//         </div>
//     );
// }

// function ConfirmModal({
//     open,
//     title,
//     message,
//     confirmText,
//     color,
//     onCancel,
//     onConfirm,
// }: {
//     open: boolean;
//     title: string;
//     message: string;
//     confirmText: string;
//     color: 'green' | 'red' | 'orange';
//     onCancel: () => void;
//     onConfirm: () => void;
// }) {
//     if (!open) return null;

//     const colors = {
//         green: 'bg-green-600 hover:bg-green-700',
//         red: 'bg-red-600 hover:bg-red-700',
//         orange: 'bg-orange-500 hover:bg-orange-600',
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//             <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
//                 <h2 className="text-2xl font-bold text-slate-900">
//                     {title}
//                 </h2>

//                 <p className="mt-3 text-slate-600">
//                     {message}
//                 </p>

//                 <div className="mt-6 flex justify-end gap-3">
//                     <button
//                         type="button"
//                         onClick={onCancel}
//                         className="rounded-xl border px-5 py-2 font-semibold hover:bg-slate-100"
//                     >
//                         Cancel
//                     </button>

//                     <button
//                         type="button"
//                         onClick={onConfirm}
//                         className={`rounded-xl px-5 py-2 font-semibold text-white ${colors[color]}`}
//                     >
//                         {confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
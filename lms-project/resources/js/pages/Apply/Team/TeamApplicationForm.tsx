import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type Props = {
    type: string;
    subject: 'english' | 'computer' | null;
    professionalRole: 'teacher' | 'staff' | null;
};

export default function TeamApplicationForm({
    type,
    subject,
    professionalRole,
}: Props) {
        const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [cvName, setCvName] = useState<string>('');

    const form = useForm({
        application_type: type,
        teacher_subject: subject ?? '',
        full_name: '',
        email: '',
        whatsapp_number: '',
        mobile_number: '',
        date_of_birth: '',
        gender: '',
        address: '',
        permanent_address: '',

        education_level: '',
        university_school: '',
        date_of_graduation: '',
        field_of_study: '',
        professional_role: professionalRole ?? '',

        language_qualification: '',
        qualification_completion_date: '',
        teaching_experience_years: '',

        computer_qualification: '',
        computer_skills: '',

        experience: '',
        skills: '',
        motivation: '',
        availability: '',
        preferred_mode: '',

        photo: null as File | null,
        cv: null as File | null,
    });

    const wordCount = useMemo(() => {
        return form.data.motivation
            .trim()
            .split(/\s+/)
            .filter(Boolean).length;
    }, [form.data.motivation]);

    function submit(e: React.FormEvent) {
        e.preventDefault();

        form.post('/apply/team/form', {
            forceFormData: true,
        });
    }

    function handlePhoto(file: File | null) {
        form.setData('photo', file);

        if (file && file.type.startsWith('image/')) {
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            setPhotoPreview(null);
        }
    }

    function handleCv(file: File | null) {
        form.setData('cv', file);
        setCvName(file?.name ?? '');
    }

   const isVolunteerTeacher = type === 'volunteer_teacher';

const isProfessionalTeacher =
    type === 'professional_staff' &&
    professionalRole === 'teacher';

const isTeacher =
    isVolunteerTeacher || isProfessionalTeacher;
    const isManager = type === 'volunteer_manager';
    const isSupport = type === 'volunteer_support';
    const isProfessional = type === 'professional_staff';

    const isEnglish = subject === 'english';
    const isComputer = subject === 'computer';
    const pageTitle = (() => {
    switch (type) {
        case 'volunteer_teacher':
            return `Volunteer ${isEnglish ? 'English' : 'Computer'} Teacher Application`;

        case 'volunteer_manager':
            return 'Volunteer Manager / Coordinator Application';

        case 'volunteer_support':
            return 'Volunteer Support Staff Application';

        case 'professional_staff':
    if (professionalRole === 'teacher') {
        return `Professional ${
            isEnglish ? 'English' : 'Computer'
        } Teacher Application`;
    }

    return 'Professional Staff Application';

        default:
            return 'Academy Team Application';
    }
})();

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-5xl space-y-8">
                <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-700 p-8 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">
                        Academy Team Application
                    </p>

                    <h1 className="mt-3 text-4xl font-bold">
                        {pageTitle}
                    </h1>

                    <p className="mt-4 max-w-3xl text-emerald-100">
                        Join our academy team and help educate underprivileged Afghan students,
                        especially female students. Volunteers are expected to commit at least
                        four hours per week for three months, including preparation time.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <Section title="Personal Information">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Input label="Full Name" value={form.data.full_name} error={form.errors.full_name} onChange={(v) => form.setData('full_name', v)} />
                            <Input label="Email Address" type="email" value={form.data.email} error={form.errors.email} onChange={(v) => form.setData('email', v)} />
                            <Input label="WhatsApp Number" value={form.data.whatsapp_number} error={form.errors.whatsapp_number} onChange={(v) => form.setData('whatsapp_number', v)} />
                            <Input label="Mobile Number" value={form.data.mobile_number} error={form.errors.mobile_number} onChange={(v) => form.setData('mobile_number', v)} />

                            <div>
                                <label className="mb-1 block font-medium">Gender</label>
                                <select
                                    className="w-full rounded-xl border px-4 py-3"
                                    value={form.data.gender}
                                    onChange={(e) => form.setData('gender', e.target.value)}
                                >
                                    <option value="">Select gender</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </select>
                                <Error message={form.errors.gender} />
                            </div>

                            <Input label="Date of Birth" type="date" value={form.data.date_of_birth} error={form.errors.date_of_birth} onChange={(v) => form.setData('date_of_birth', v)} />
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <Textarea label="Current Residence" value={form.data.address} error={form.errors.address} onChange={(v) => form.setData('address', v)} />
                            <Textarea label="Permanent Address" value={form.data.permanent_address} error={form.errors.permanent_address} onChange={(v) => form.setData('permanent_address', v)} />
                        </div>
                    </Section>

                    <Section title="Education & Qualifications">
                        <div className="grid gap-5 md:grid-cols-2">
                           <div>
    <label className="mb-1 block font-medium">
        Highest Qualification
    </label>

    <select
        value={form.data.education_level}
        onChange={(e) =>
            form.setData('education_level', e.target.value)
        }
        className="w-full rounded-xl border px-4 py-3"
    >
        <option value="">Select your highest qualification</option>

        <option value="Currently in High School">
            Currently in High School
        </option>

        <option value="High School Graduate">
            High School Graduate
        </option>

        <option value="Certificate">
            Certificate
        </option>

        <option value="Diploma">
            Diploma
        </option>

        <option value="Associate Degree">
            Associate Degree
        </option>

        <option value="Bachelor's Degree">
            Bachelor's Degree
        </option>

        <option value="Master's Degree">
            Master's Degree
        </option>

        <option value="Doctorate / PhD">
            Doctorate / PhD
        </option>

        <option value="Other">
            Other / Not Listed
        </option>
    </select>

    <Error message={form.errors.education_level} />
</div>
                            <Input label="University / School" value={form.data.university_school} error={form.errors.university_school} onChange={(v) => form.setData('university_school', v)} />
                            <Input label="Date of Graduation" type="date" value={form.data.date_of_graduation} error={form.errors.date_of_graduation} onChange={(v) => form.setData('date_of_graduation', v)} />

  {isTeacher && (
    isEnglish ? (
        <>
            <Textarea
                label="English Language Qualification"
                value={form.data.language_qualification}
                error={form.errors.language_qualification}
                onChange={(v) =>
                    form.setData('language_qualification', v)
                }
                placeholder="Example: English diploma, IELTS, TOEFL, teaching certificate, institute name..."
            />

            <Input
                label="Date of Completion"
                type="date"
                value={form.data.qualification_completion_date}
                error={form.errors.qualification_completion_date}
                onChange={(v) =>
                    form.setData('qualification_completion_date', v)
                }
            />

            <Input
                label="Total Years of English Teaching Experience"
                type="number"
                value={form.data.teaching_experience_years}
                error={form.errors.teaching_experience_years}
                onChange={(v) =>
                    form.setData('teaching_experience_years', v)
                }
            />
        </>
    ) : (
        <>
            <Textarea
                label="Computer Qualification"
                value={form.data.computer_qualification}
                error={form.errors.computer_qualification}
                onChange={(v) =>
                    form.setData('computer_qualification', v)
                }
                placeholder="Example: Computer diploma, IT certificate, programming course, university study..."
            />

            <Input
                label="Date of Completion"
                type="date"
                value={form.data.qualification_completion_date}
                error={form.errors.qualification_completion_date}
                onChange={(v) =>
                    form.setData('qualification_completion_date', v)
                }
            />

            <Input
                label="Total Years of Computer Teaching Experience"
                type="number"
                value={form.data.teaching_experience_years}
                error={form.errors.teaching_experience_years}
                onChange={(v) =>
                    form.setData('teaching_experience_years', v)
                }
            />
        </>
    )
)}
                        </div>



                        

                       {isTeacher && isComputer && (
                            <div className="mt-5">
                                <Textarea
                                    label="Computer Skills / Tools"
                                    value={form.data.computer_skills}
                                    error={form.errors.computer_skills}
                                    onChange={(v) => form.setData('computer_skills', v)}
                                    placeholder="Example: MS Office, web development, programming, networking, graphic design..."
                                />
                            </div>
                        )}
                    </Section>

                    <Section title="Role Specific Information">

    {isTeacher && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5">
            <h3 className="text-lg font-semibold text-emerald-900">
                Teaching Information
            </h3>

            <p className="mt-2 text-sm text-emerald-700">
                Tell us about your teaching experience and subject expertise.
            </p>
        </div>
    )}

    {isManager && (
        <div className="space-y-5">

            <Textarea
                label="Management / Coordination Experience"
                value={form.data.experience}
                error={form.errors.experience}
                onChange={(v) => form.setData('experience', v)}
                placeholder="Describe your management, leadership, coordination or organizational experience."
            />

            <Textarea
                label="Administrative Skills"
                value={form.data.skills}
                error={form.errors.skills}
                onChange={(v) => form.setData('skills', v)}
                placeholder="Planning, communication, reporting, scheduling, leadership..."
            />

        </div>
    )}

    {isSupport && (
        <div className="space-y-5">

            <Textarea
                label="Support Experience"
                value={form.data.experience}
                error={form.errors.experience}
                onChange={(v) => form.setData('experience', v)}
                placeholder="Describe any administrative, technical, event or documentation experience."
            />

            <Textarea
                label="Technical / Office Skills"
                value={form.data.skills}
                error={form.errors.skills}
                onChange={(v) => form.setData('skills', v)}
                placeholder="Microsoft Office, IT support, networking, social media, documentation..."
            />

        </div>
    )}

    {isProfessional && (
        <div className="space-y-5">

            <Input
                label="Position Applying For"
                value={form.data.field_of_study}
                error={form.errors.field_of_study}
                onChange={(v) => form.setData('field_of_study', v)}
                placeholder="Example: English Teacher, Academic Coordinator, IT Officer..."
            />

            <Textarea
                label="Professional Experience"
                value={form.data.experience}
                error={form.errors.experience}
                onChange={(v) => form.setData('experience', v)}
                placeholder="Describe your professional work experience."
            />

        </div>
    )}

</Section>

                    <Section title="Biography">
                        {isVolunteerTeacher && (
    <Textarea
        label="Teaching / Work Experience"
        value={form.data.experience}
        error={form.errors.experience}
        onChange={(v) => form.setData('experience', v)}
        placeholder="Briefly describe your teaching experience..."
    />
)}

                        {isVolunteerTeacher && (
                        <div className="mt-5">
                            <Textarea
                                label="Teaching Skills"
                                value={form.data.skills}
                                error={form.errors.skills}
                                onChange={(v) => form.setData('skills', v)}
                                placeholder="Mention teaching skills that can help the academy..."
                            />
                        </div>
                    )}

                        <div className={isTeacher ? 'mt-5' : ''}>
                            <Textarea
                                label="How would you describe yourself? Minimum 150-word biography"
                                value={form.data.motivation}
                                error={form.errors.motivation}
                                onChange={(v) => form.setData('motivation', v)}
                                rows={8}
                            />

                            <p className={`mt-2 text-sm font-medium ${wordCount >= 150 ? 'text-green-600' : 'text-yellow-700'}`}>
                                Word count: {wordCount} / 150
                            </p>
                        </div>
                    </Section>

                    <Section title="Availability">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Input
                                label="Availability"
                                value={form.data.availability}
                                error={form.errors.availability}
                                onChange={(v) => form.setData('availability', v)}
                                placeholder="Example: 4 hours/week, weekends, evenings..."
                            />

                            <div>
                                <label className="mb-1 block font-medium">Preferred Teaching Mode</label>
                                <select
                                    className="w-full rounded-xl border px-4 py-3"
                                    value={form.data.preferred_mode}
                                    onChange={(e) => form.setData('preferred_mode', e.target.value)}
                                >
                                    <option value="">Select mode</option>
                                    <option value="online">Online</option>
                                    <option value="physical">Physical</option>
                                    <option value="both">Both</option>
                                </select>
                                <Error message={form.errors.preferred_mode} />
                            </div>
                        </div>
                    </Section>

                    <Section title="Uploads">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block font-medium">Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full rounded-xl border bg-white px-4 py-3"
                                    onChange={(e) => handlePhoto(e.target.files?.[0] ?? null)}
                                />
                                <Error message={form.errors.photo} />

                                {photoPreview && (
                                    <img
                                        src={photoPreview}
                                        alt="Photo preview"
                                        className="mt-4 h-36 w-36 rounded-xl border object-cover"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">Curriculum Vitae / CV</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="w-full rounded-xl border bg-white px-4 py-3"
                                    onChange={(e) => handleCv(e.target.files?.[0] ?? null)}
                                />
                                <Error message={form.errors.cv} />

                                {cvName && (
                                    <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                                        Selected CV: <strong>{cvName}</strong>
                                    </p>
                                )}
                            </div>
                        </div>
                    </Section>

                    <div className="rounded-3xl bg-white p-6 shadow">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white hover:bg-emerald-700 disabled:bg-gray-400"
                        >
                            {form.processing ? 'Submitting Application...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">{title}</h2>
            {children}
        </section>
    );
}

function Input({
    label,
    value,
    onChange,
    type = 'text',
    error,
    placeholder,
}: {
    label: string;
    value: any;
    onChange: (value: string) => void;
    type?: string;
    error?: string;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="mb-1 block font-medium">{label}</label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                className="w-full rounded-xl border px-4 py-3"
                onChange={(e) => onChange(e.target.value)}
            />
            <Error message={error} />
        </div>
    );
}

function Textarea({
    label,
    value,
    onChange,
    error,
    placeholder,
    rows = 4,
}: {
    label: string;
    value: any;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <div>
            <label className="mb-1 block font-medium">{label}</label>
            <textarea
                rows={rows}
                value={value}
                placeholder={placeholder}
                className="w-full rounded-xl border px-4 py-3"
                onChange={(e) => onChange(e.target.value)}
            />
            <Error message={error} />
        </div>
    );
}

function Error({ message }: { message?: string }) {
    if (!message) return null;

    return <p className="mt-1 text-sm text-red-600">{message}</p>;
}
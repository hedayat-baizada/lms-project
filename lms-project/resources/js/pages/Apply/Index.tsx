import { Link } from '@inertiajs/react';

export default function ApplyIndex() {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
                <div className="grid w-full gap-8 lg:grid-cols-2">
                    <div className="flex flex-col justify-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                            Admissions Portal
                        </p>

                        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
                            Start your journey with our academy
                        </h1>

                        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                            Apply online, complete your placement assessment, upload
                            required documents, and track your application status in one place.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <Feature title="Online Application" />
                            <Feature title="Placement Test" />
                            <Feature title="Status Tracking" />
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-8 shadow-xl">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Choose an option
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Select the service you want to continue with.
                        </p>

                        <div className="mt-8 space-y-4">
                            <ActionCard
                                href="/apply/student"
                                title="Register as Student"
                                description="Submit your admission application and complete placement steps."
                                color="blue"
                            />

                            <ActionCard
                                href="/track"
                                title="Track My Application"
                                description="Check your application status using your tracking code."
                                color="yellow"
                            />

                            <DisabledCard
                                title="Register as Teacher"
                                description="Teacher registration will be available later."
                            />

                            <DisabledCard
                                title="Register as Volunteer"
                                description="Volunteer registration will be available later."
                            />

                            <DisabledCard
                                title="Already Accepted? Login"
                                description="Student login will be available after account creation."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Feature({ title }: { title: string }) {
    return (
        <div className="rounded-2xl border bg-white/70 p-4 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                ✓
            </div>
            <p className="font-semibold text-slate-800">{title}</p>
        </div>
    );
}

function ActionCard({
    href,
    title,
    description,
    color,
}: {
    href: string;
    title: string;
    description: string;
    color: 'blue' | 'yellow';
}) {
    const colors = {
        blue: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50',
        yellow: 'border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50',
    };

    return (
        <Link
            href={href}
            className={`block rounded-2xl border p-5 transition ${colors[color]}`}
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                </div>

                <span className="text-2xl text-slate-400">→</span>
            </div>
        </Link>
    );
}

function DisabledCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border bg-slate-50 p-5 opacity-70">
            <h3 className="font-bold text-slate-700">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
    );
}
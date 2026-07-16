import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export default function PublicApplicationLayout({ children }: Props) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex min-h-screen flex-col bg-slate-100">
            <header className="border-b border-slate-200 bg-white shadow-sm">
               <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href="/apply"
                        className="flex items-center"
                    >
                        <img
                            src="/images/alpha-logo-wide.png"
                            alt="ALPHA Educational Society"
                            className="h-12 w-auto max-w-full object-contain sm:h-14"
                        />
                    </Link>

                    <nav className="flex items-center gap-3">
                        <Link
                            href="/apply"
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-700"
                        >
                            Home
                        </Link>

                        <Link
                            href="/track"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Track Application
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="mt-12 border-t border-slate-200 bg-slate-900 text-slate-300">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
                    <div>
                        <img
                            src="/images/alpha-logo-wide.png"
                            alt="ALPHA Educational Society"
                            className="h-14 w-auto max-w-full rounded bg-white object-contain p-1"
                        />

                        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                            Supporting education, opportunity, and academic
                            development through accessible learning programs.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold text-white">
                            Application Portal
                        </h2>

                        <div className="mt-4 flex flex-col items-start gap-3 text-sm">
                            <Link
                                href="/apply"
                                className="hover:text-white hover:underline"
                            >
                                Apply
                            </Link>

                            <Link
                                href="/track"
                                className="hover:text-white hover:underline"
                            >
                                Track Your Application
                            </Link>

                            <Link
                                href="/login"
                                className="hover:text-white hover:underline"
                            >
                                Applicant Login
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-bold text-white">
                            Contact Information
                        </h2>

                        <div className="mt-4 space-y-2 text-sm text-slate-400">
                            <p>
                                Email: info@example.com
                            </p>

                            <p>
                                WhatsApp: +93 XXX XXX XXX
                            </p>

                            <p>
                                Afghanistan
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 px-6 py-5 text-center text-sm text-slate-500">
                    © {currentYear} ALPHA Educational Society. All rights
                    reserved.
                </div>
            </footer>
        </div>
    );
}
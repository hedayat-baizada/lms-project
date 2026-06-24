import { Link } from '@inertiajs/react';

export default function ApplyIndex() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Academy Registration
                </h1>

                <div className="space-y-3">

                    <Link
                        href="/apply/student"
                        className="block w-full bg-blue-600 text-white py-3 rounded text-center"
                    >
                        Register as Student
                    </Link>

                    <button className="w-full bg-green-600 text-white py-3 rounded">
                        Register as Teacher
                    </button>

                    <button className="w-full bg-purple-600 text-white py-3 rounded">
                        Register as Volunteer
                    </button>

                    <Link
                        href="/track"
                        className="block w-full bg-yellow-500 text-white py-3 rounded text-center"
                    >
                        Track My Application
                    </Link>

                    <button className="w-full bg-gray-700 text-white py-3 rounded">
                        Already Accepted? Login
                    </button>

                </div>
            </div>
        </div>
    );
}
import { useForm, usePage } from '@inertiajs/react';
import PublicApplicationLayout from '@/layouts/public-application-layout';

type PageProps = {
    application: {
        id: number;
        full_name: string;
    };
};

export default function CourseStep() {
    const { application } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        course_category: '',
        course_track: '',
        requested_level: '',
        selected_computer_topic: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/apply/student/${application.id}/course`);
    }

    const isEnglish = data.course_category === 'english';
    const isComputer = data.course_category === 'computer';
    const isPrepCel = data.course_track === 'prep_cel';
    const isCel = data.course_track === 'cel';

    return (
          <PublicApplicationLayout>
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="mx-auto max-w-2xl bg-white p-8 rounded shadow">
                <h1 className="text-3xl font-bold mb-2">
                    Course Selection
                </h1>

                <p className="mb-6 text-gray-600">
                    Applicant: {application.full_name}
                </p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Course Category</label>
                        <select
                            className="w-full border rounded p-2"
                            value={data.course_category}
                            onChange={(e) => {
                                setData('course_category', e.target.value);
                                setData('course_track', '');
                                setData('requested_level', '');
                                setData('selected_computer_topic', '');
                            }}
                        >
                            <option value="">Select category</option>
                            <option value="english">English Courses</option>
                            <option value="computer">Computer Courses</option>
                        </select>
                        {errors.course_category && (
                            <p className="text-red-600">{errors.course_category}</p>
                        )}
                    </div>

                    {isEnglish && (
                        <div>
                            <label className="block mb-1">English Track</label>
                            <select
                                className="w-full border rounded p-2"
                                value={data.course_track}
                                onChange={(e) => {
                                    setData('course_track', e.target.value);
                                    setData('requested_level', '');
                                }}
                            >
                                <option value="">Select track</option>
                                <option value="prep_cel">Prep-CEL</option>
                                <option value="cel">CEL</option>
                            </select>
                        </div>
                    )}

                    {isPrepCel && (
                        <div>
                            <label className="block mb-1">Requested Prep-CEL Level</label>
                            <select
                                className="w-full border rounded p-2"
                                value={data.requested_level}
                                onChange={(e) => setData('requested_level', e.target.value)}
                            >
                                <option value="">Select level</option>
                                <option value="A1">A1 - No test</option>
                                <option value="A2">A2 - Written test required</option>
                                <option value="A3">A3 - Written test required</option>
                                <option value="A4">A4 - Written test required</option>
                                <option value="A5">A5 - Written test required</option>
                                <option value="A6">A6 - Written test required</option>
                            </select>
                        </div>
                    )}

                    {isCel && (
                        <div>
                            <label className="block mb-1">Requested CEL Level</label>
                            <select
                                className="w-full border rounded p-2"
                                value={data.requested_level}
                                onChange={(e) => setData('requested_level', e.target.value)}
                            >
                                <option value="">Select level</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>

                            <p className="mt-2 text-sm text-gray-600">
                                CEL requires written and speaking test.
                            </p>
                        </div>
                    )}

                    {isComputer && (
                        <div>
                            <label className="block mb-1">Computer Topic</label>
                            <select
                                className="w-full border rounded p-2"
                                value={data.selected_computer_topic}
                                onChange={(e) =>
                                    setData('selected_computer_topic', e.target.value)
                                }
                            >
                                <option value="">Select topic</option>
                                <option value="windows">Windows</option>
                                <option value="word">Word</option>
                                <option value="excel">Excel</option>
                                <option value="powerpoint">PowerPoint</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-3 rounded"
                    >
                        {processing ? 'Saving...' : 'Save and Continue'}
                    </button>
                </form>
            </div>
        </div>
        </PublicApplicationLayout>
    );
}
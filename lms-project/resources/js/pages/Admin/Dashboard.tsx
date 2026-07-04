import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';


import SuperAdminDashboard from './Dashboards/SuperAdminDashboard';
import AdminDashboard from './Dashboards/AdminDashboard';
import AdmissionDashboard from './Dashboards/AdmissionDashboard';
import AcademicDashboard from './Dashboards/AcademicDashboard';
import TeacherDashboard from './Dashboards/TeacherDashboard';
import VolunteerDashboard from './Dashboards/VolunteerDashboard';
import ReportDashboard from './Dashboards/ReportDashboard';
import StudentDashboard from './Dashboards/StudentDashboard';

type Props = {
    roles: string[];
    stats: any;
};

export default function Dashboard({ roles, stats }: Props) {
    const role = roles[0];

    return (
        <AppLayout>
            <Head title="Dashboard" />

            {role === 'Super Admin' && <SuperAdminDashboard stats={stats} />}
            {role === 'Admin' && <AdminDashboard stats={stats} />}
            {role === 'Admission Officer' && <AdmissionDashboard stats={stats} />}
            {role === 'Course Manager' && <AcademicDashboard stats={stats} />}
            {role === 'Teacher' && <TeacherDashboard stats={stats} />}
            {role === 'Volunteer' && <VolunteerDashboard stats={stats} />}
            {role === 'Report Manager' && <ReportDashboard stats={stats} />}
            {role === 'Student' && <StudentDashboard stats={stats} />}
        </AppLayout>
    );
}
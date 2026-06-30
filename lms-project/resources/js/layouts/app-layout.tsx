import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import FlashToast from '@/components/FlashToast';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>

        <FlashToast />

        
        {children}
    </AppLayoutTemplate>
);

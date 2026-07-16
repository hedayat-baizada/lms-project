import { usePage } from '@inertiajs/react';

export function useCan() {
    const page = usePage<any>();

    return (permission: string) =>
        page.props.auth?.user?.permissions?.includes(permission) ?? false;
}
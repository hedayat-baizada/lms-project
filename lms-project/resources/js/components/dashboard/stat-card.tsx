import { ReactNode } from 'react';

type Props = {
    title: string;
    value: number | string;
    icon: ReactNode;
};

export default function StatCard({
    title,
    value,
    icon,
}: Props) {
    return (
        <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative flex items-center justify-between">

                <div>
                    <p className="text-sm text-muted-foreground">
                        {title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold">
                        {value}
                    </h3>
                </div>

                <div className="rounded-2xl bg-primary/10 p-4 text-primary transition-transform duration-300 group-hover:scale-110">
                    {icon}
                </div>

            </div>
        </div>
    );
}
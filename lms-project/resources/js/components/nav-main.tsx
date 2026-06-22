import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>AES Platform</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    // Dashboard
                    if (item.url) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.url === page.url}
                                >
                                    <Link href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    const isGroupActive = (item: NavItem) => {
                        return item.children?.some(
                            (child) => child.url === page.url
                        );
                    };


                    // Collapsible Groups
                    return (
                        <Collapsible
                            key={item.title}
                            defaultOpen={isGroupActive(item)}
                            className="group"
                        >
                            <SidebarMenuItem>

                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        <ChevronRight
                                            className=" h-4 w-4
                                                        transition-transform
                                                        duration-200
                                                        group-data-[state=open]:rotate-90
                                                    "
                                        />
                                        <>
                                            {item.icon && <item.icon className="h-4 w-4" />}
                                            <span>{item.title}</span>
                                        </>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>

                                        {item.children?.map((child) => (
                                            <SidebarMenuSubItem
                                                key={child.title}
                                            >
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={
                                                        child.url === page.url
                                                    }
                                                >
                                                    <Link href={child.url ?? '#'}>
                                                        {child.icon && (
                                                            <child.icon className="mr-2 h-4 w-4" />
                                                        )}
                                                        {child.title}
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}

                                    </SidebarMenuSub>
                                </CollapsibleContent>

                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
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
                    return item.children?.some((child) => {
                        // Direct child is active
                        if (child.url === page.url) {
                            return true;
                        }

                        // One of the grandchildren is active
                        return child.children?.some(
                            (grandChild) => grandChild.url === page.url
                        );
                    });
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

                                       {item.children?.map((child) =>
    child.children ? (
        <Collapsible 
        key={child.title}
    defaultOpen={child.children?.some(
        (grandChild) => grandChild.url === page.url
    )}
     className="group/sub">
            <SidebarMenuSubItem>

                <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton>
                        <ChevronRight
                            className="mr-1 h-4 w-4 transition-transform group-data-[state=open]/sub:rotate-90"
                        />

                        {child.icon && (
                            <child.icon className="mr-1 h-4 w-4" />
                        )}

                        <span className="truncate">
                            {child.title}
                        </span>
                    </SidebarMenuSubButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub className="ml-2 border-l pl-2">
                        {child.children.map((grandChild) => (
                            <SidebarMenuSubItem
                                key={grandChild.title}
                                className="my-1"
                            >
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={grandChild.url === page.url}
                                >
                                    <Link
                                        href={grandChild.url ?? '#'}
                                        className="flex items-center gap-2"
                                    >
                                        {grandChild.icon && (
                                            <grandChild.icon className="h-4 w-4 shrink-0" />
                                        )}

                                        <span className="whitespace-normal">
                                            {grandChild.title}
                                        </span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>

            </SidebarMenuSubItem>
        </Collapsible>
    ) : (
        <SidebarMenuSubItem key={child.title}>
            <SidebarMenuSubButton
                asChild
                isActive={child.url === page.url}
            >
                <Link
                    href={child.url ?? '#'}
                    className="flex items-center gap-2"
                >
                    {child.icon && (
                        <child.icon className="h-4 w-4 shrink-0" />
                    )}

                    <span className="truncate">
                        {child.title}
                    </span>
                </Link>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    )
)}
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
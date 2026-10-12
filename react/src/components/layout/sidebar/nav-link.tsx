import { ChevronLeft } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { routes } from "../../../routes/routes";
import { Link, useLocation } from "react-router-dom";
import { checkAccess, cn } from "@/lib/utils";

type GroupedChildren = {
    separator?: string;
    separatorIcon?: any;
    items: any[];
};

function groupChildrenBySeparator(children: any[]): GroupedChildren[] {
    const groups: GroupedChildren[] = [];
    let currentGroup: GroupedChildren = { items: [] };

    children.forEach((child) => {
        if (child.seperator) {
            groups.push(currentGroup);
            currentGroup = {
                separator: child.seperator,
                separatorIcon: child.seperatorIcon,
                items: [child],
            };
        } else {
            currentGroup.items.push(child);
        }
    });

    groups.push(currentGroup);
    return groups;
}

function RenderSeparatorGroup({ group, isCurrentPath }: { group: GroupedChildren; isCurrentPath: (path: string) => boolean }) {
    const isOpen = group.items.some((item) => isCurrentPath(item.path));

    return (
        <Collapsible asChild className="group/collapsible-separator" defaultOpen={isOpen}>
            <div>
                <CollapsibleTrigger asChild>
                    <div className="relative flex items-center cursor-pointer py-1.5 my-1.5 px-2 hover:bg-secondary rounded-md">
                        <div className="flex items-center gap-2">
                            <span className="icon">{group.separatorIcon && <group.separatorIcon className="size-3.5" />}</span>
                            <span className="text-[0.85rem] font-medium">{group.separator}</span>
                        </div>
                        <ChevronLeft className="absolute left-0 size-3 transition-transform duration-200 group-data-[state=open]/collapsible-separator:rotate-90" />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-1">
                    <div className="flex flex-col gap-1.5 mr-3 border-r border-gray-200 pr-3">
                        {group.items
                            .filter((child: any) => !child?.role || checkAccess(child?.role))
                            .map((child: any) => (
                                <SidebarMenuSubItem key={child.title}>
                                    <SidebarMenuSubButton asChild>
                                        <Link to={child.path} role="link" className={cn("py-4", isCurrentPath(child.path) ? "bg-secondary" : "")}>
                                            <span className="text-[0.8rem]">{child.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}

function RenderPlainGroup({ group, isCurrentPath }: { group: GroupedChildren; isCurrentPath: (path: string) => boolean }) {
    return (
        <>
            {group.items
                .filter((child: any) => !child?.role || checkAccess(child?.role))
                .map((child: any) => (
                    <SidebarMenuSubItem key={child.title}>
                        <SidebarMenuSubButton asChild>
                            <Link to={child.path} role="link" className={cn("py-4", isCurrentPath(child.path) ? "bg-secondary" : "")}>
                                <span className="text-[0.8rem]">{child.title}</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                ))}
        </>
    );
}

export function NavLink() {
    const location = useLocation();

    const activeLinks = routes?.[0].children?.filter((route: any) => route.active && (!route?.role || checkAccess(route.role))) || [];

    const hasChildren = (path: any) => path?.children?.length > 0;
    const isCurrentPath = (path: string) => path === location.pathname;
    const hasActiveChild = (route: any) => {
        if (!hasChildren(route)) return false;
        return route.children.some((child: any) => child.path === location.pathname);
    };

    const getAccessibleGroups = (children: any[]): GroupedChildren[] => {
        const allGroups = groupChildrenBySeparator(children || []);

        return allGroups
            .map((group) => ({
                ...group,
                items: group.items.filter((child: any) => {
                    if (child.seperator) return true;
                    return child.active && (!child?.role || checkAccess(child.role));
                }),
            }))
            .filter((group) => {
                if (group.items.length === 0) return false;
                if (group.separator) {
                    return group.items.some((item) => !item.seperator || (item.active && (!item?.role || checkAccess(item.role))));
                }
                return true;
            });
    };

    return (
        <SidebarGroup>
            <SidebarMenu>
                {activeLinks.map((route: any) => (
                    <Collapsible key={route.title} asChild className="group/collapsible-submenu" defaultOpen={hasActiveChild(route)}>
                        <SidebarMenuItem>
                            {!hasChildren(route) ? (
                                <SidebarMenuButton
                                    tooltip={route.title}
                                    className={cn("cursor-pointer my-1 py-5 hover:bg-secondary", isCurrentPath(route.path) ? "bg-secondary" : "")}
                                >
                                    {route.icon && <route.icon />}
                                    <Link to={route.path} role="link">
                                        <span className="text-[0.9rem] font-bold">{route.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            ) : (
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={route.title}
                                        className={cn("relative cursor-pointer my-1 py-5 hover:bg-secondary", isCurrentPath(route.path) ? "bg-secondary" : "")}
                                    >
                                        {route.icon && <route.icon />}
                                        <span className="text-[0.9rem] font-bold">{route.title}</span>
                                        <ChevronLeft className="absolute left-0 size-3 transition-transform duration-200 group-data-[state=open]/collapsible-submenu:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                            )}

                            {hasChildren(route) && (
                                <CollapsibleContent className="pt-1 mr-3.5">
                                    <SidebarMenuSub>
                                        {getAccessibleGroups(route.children || []).map((group, idx) => (
                                            <div key={idx}>
                                                {group.separator ? (
                                                    <RenderSeparatorGroup group={group} isCurrentPath={isCurrentPath} />
                                                ) : (
                                                    <RenderPlainGroup group={group} isCurrentPath={isCurrentPath} />
                                                )}
                                            </div>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            )}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

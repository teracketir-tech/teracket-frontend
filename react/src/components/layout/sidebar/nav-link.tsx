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
    useSidebar,
} from "@/components/ui/sidebar";
import { routes } from "../../../routes/routes";
import { Link, useLocation } from "react-router-dom";
import { checkAccess, cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function NavLink() {
    const { auth } = useAuth();
    const { open } = useSidebar();
    const location = useLocation();

    const activeLinks = routes?.[0].children?.filter((route: any) => route.active && (!route?.role || checkAccess(route.role))) || [];

    const hasChildren = (path: any) => path?.children?.length > 0;
    const isCurrentPath = (path: string) => path === location.pathname;
    const isCurrentChildPath = (path: any) => hasChildren(path) && path.children.some((ch: any) => ch.path === location.pathname);

    return (
        <SidebarGroup>
            <SidebarMenu>
                {activeLinks.map((route: any) => (
                    <Collapsible key={route.title} asChild className="group/collapsible" defaultOpen={isCurrentChildPath(route)}>
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
                                        <>
                                            {route.icon && <route.icon />}
                                            <span className="text-[0.9rem] font-bold">{route.title}</span>
                                        </>
                                        {open && (
                                            <ChevronLeft className="absolute left-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        )}
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                            )}

                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {route.children
                                        ?.filter((ch: any) => ch.active && (!ch?.role || checkAccess(ch.role)))
                                        ?.map((child: any) => (
                                            <>
                                                {child?.seperator && (
                                                   <div style={{ position: 'relative' }}>
                                                        <div className="seperator-menu-group-label text-gray-400">
                                                          <span className="icon"> {child.seperatorIcon && <child.seperatorIcon className="size-3" />}</span>
                                                         <span className="seperator-label">{child.seperator}</span>
                                                         </div>
                                                         <p className="seperator-menu-group-line"></p>
                                                    </div>
                                                )}

                                                {(child?.path !== "/accounting/create" || auth?.company_id != 1) && (
                                                    <SidebarMenuSubItem key={child.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <Link
                                                                to={child.path}
                                                                role="link"
                                                                className={cn("py-4", isCurrentPath(child.path) ? "bg-secondary" : "")}
                                                            >
                                                                <span className="text-[0.8rem]">{child.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )}
                                            </>
                                        ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

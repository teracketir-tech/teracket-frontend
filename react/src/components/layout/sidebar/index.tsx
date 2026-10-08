import * as React from "react";

import { NavLink } from "@/components/layout/sidebar/nav-link";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import { AppInfo } from "@/components/layout/sidebar/app-info";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props} className="hide_print">
            <SidebarHeader>
                <AppInfo />
            </SidebarHeader>

            <SidebarContent>
                <NavLink />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

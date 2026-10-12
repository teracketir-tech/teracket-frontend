import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { companyLabel } from "@/lib/company";

/**
 * Name, phone and the company badge - shared by the collapsed trigger and the
 * open menu so the two copies of the same block cannot drift apart.
 *
 * `justify` is passed by the caller because the two places align their content
 * differently, and a flex row ignores the text alignment of its parent.
 */
function UserIdentity({ justify }: { justify: "justify-center" | "justify-start" }) {
    const { auth } = useAuth();

    const fullName = `${auth?.first_name || ""} ${auth?.last_name || ""}`;

    return (
        <div className={`grid flex-1 text-xs leading-tight ${justify === "justify-center" ? "text-center" : "text-right"}`}>
            <span className={`flex items-center gap-1.5 ${justify}`}>
                <span className="min-w-0 truncate font-medium">{fullName}</span>
                <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[0.6rem] font-semibold text-gray-600">{companyLabel(auth?.company_id, auth?.company_name)}</span>
            </span>
            <span className="mt-1 truncate text-right text-[0.65rem] text-gray-400">{auth?.phone_number}</span>
        </div>
    );
}

export function NavUser() {
    const { isMobile } = useSidebar();
    const { auth, logout } = useAuth();

    const authBriefName = `${auth?.first_name?.slice(0, 1) || ""} ${auth?.last_name?.slice(0, 1) || ""}`;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-8 rounded-lg border">
                                    <AvatarFallback className="rounded-lg">{authBriefName}</AvatarFallback>
                                </Avatar>
                                <UserIdentity justify="justify-center" />
                            </div>
                            <ChevronsUpDown className="mr-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-8 rounded-lg border">
                                    <AvatarFallback className="rounded-lg">{authBriefName}</AvatarFallback>
                                </Avatar>
                                <UserIdentity justify="justify-start" />
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem className="border-b border-gray-100" disabled>
                                <BadgeCheck />
                                پروفایل
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Bell />
                                پیام ها
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={logout}>
                            <LogOut color="red" />
                            خروج
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

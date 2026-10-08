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

export function NavUser() {
    const { isMobile } = useSidebar();
    const { auth, logout } = useAuth();

    const authFullName = `${auth?.first_name || ""} ${auth?.last_name || ""}`;
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
                                <div className="grid flex-1 text-center text-xs leading-tight">
                                    <span className="truncate font-medium">{authFullName}</span>
                                    <span className="truncate text-[0.65rem] text-gray-400 mt-1">{auth?.phone_number}</span>
                                </div>
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
                                <div className="grid flex-1 text-right text-xs leading-tight">
                                    <span className="truncate font-medium">{authFullName}</span>
                                    <span className="truncate text-[0.65rem] text-gray-400 mt-1">{auth?.phone_number}</span>
                                </div>
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

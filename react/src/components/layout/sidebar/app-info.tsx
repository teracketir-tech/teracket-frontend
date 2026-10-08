import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export function AppInfo() {
    const { open } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="w-full flex items-center gap-5 border-b pt-2 pb-3 h-14">
                    <div className="flex size-8 border items-center justify-center rounded-lg">
                        <img src="/logo.png" className="size-6" />
                    </div>
                    {open && (
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="font-medium">پایگان گروپ ( حسابداری )</span>
                            <span className="flex items-center gap-1 text-[0.7rem] text-gray-400">
                                <span>ورژن</span>
                                <span>:</span>
                                <span>{import.meta.env.VITE_APP_VERSION}</span>
                            </span>
                        </div>
                    )}
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

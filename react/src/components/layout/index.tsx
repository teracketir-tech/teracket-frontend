import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AppSidebar } from "./sidebar";
import { SidebarTrigger } from "../ui/sidebar";
import AppProvider from "@/context/AppContext";
import { pageTitle, pathName } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();

    const isLoginPage = location.pathname === "/login";
    const isFactorPage = pathName() === "/order/:id/factor";
    const isHomePage = location.pathname === "/" || pageTitle() === "داشبورد";

    return (
        <AppProvider>
            {!isLoginPage && !isFactorPage && <AppSidebar />}
            <Toaster position="top-center" />

            <main className="w-full">
                {!isLoginPage && !isFactorPage && (
                    <div className="sticky top-0 z-50 hide_print">
                        <div className="relative flex items-center bg-sidebar py-[1.3rem]">
                            <SidebarTrigger className="absolute -right-3.5 z-50" />
                            <div className="flex items-center gap-3 mr-8">
                                {!isHomePage && (
                                    <button className="cursor-pointer" onClick={() => navigate(-1)}>
                                        <ArrowRight className="size-4.5 mt-1" />
                                    </button>
                                )}
                                <p className="font-bold">{pageTitle()}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-5">
                    <Outlet />
                </div>
            </main>
        </AppProvider>
    );
}

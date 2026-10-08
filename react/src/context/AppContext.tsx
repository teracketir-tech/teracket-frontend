import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "./AuthContext";

export default function AppProvider({ children }: { children: any }) {
    return (
        <AuthProvider>
            <SidebarProvider>{children}</SidebarProvider>
        </AuthProvider>
    );
}

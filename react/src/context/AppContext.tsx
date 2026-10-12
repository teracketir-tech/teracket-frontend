import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "./AuthContext";
import { VersionProvider } from "./VersionContext";

export default function AppProvider({ children }: { children: any }) {
    return (
        <AuthProvider>
            <VersionProvider>
                <SidebarProvider>{children}</SidebarProvider>
            </VersionProvider>
        </AuthProvider>
    );
}

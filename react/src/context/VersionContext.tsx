import { api } from "@/lib/axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";

interface VersionContextType {}

const versionContext = createContext<VersionContextType | undefined>(undefined);

export const VersionProvider = ({ children }: { children: any }) => {
    const { auth } = useAuth();
    const [open, setOpen] = useState(false);
    const [version, setVersion] = useState("");

    useEffect(() => {
        if (auth?.id) fetchApiVersion();
    }, [auth]);

    const fetchApiVersion = async () => {
        const res = await api("app/last-version");

        if (res?.version) {
            const apiVersion = res.version;
            const appVersion = import.meta.env.VITE_APP_VERSION;

            setVersion(apiVersion);

            if (appVersion !== apiVersion) setOpen(true);
        }
    };

    return (
        <versionContext.Provider value={{}}>
            <>
                {children}
                <Modal open={open} setOpen={setOpen} dismissible={false} title="به‌روزرسانی جدید">
                    <div className="flex flex-col items-center justify-center gap-5 text-sm">
                        <p>نسخه جدید ( {version} ) منتشر شده است. برای دریافت آخرین نسخه، روی دکمه زیر کلیک کنید.</p>
                        <Button onClick={() => window.location.reload()}>به‌روزرسانی</Button>
                    </div>
                </Modal>
            </>
        </versionContext.Provider>
    );
};

export const useVersion = () => {
    const context = useContext(versionContext);

    if (!context) {
        throw new Error("useVersion must be used within a SidebarProvider.");
    }

    return context;
};

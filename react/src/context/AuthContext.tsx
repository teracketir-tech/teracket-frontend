import { api } from "@/lib/axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
    auth: any;
    token: string | null;
    updateToken: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: any }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [auth, setAuth] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const isLogin = async () => await api("user/is-login");

        if (auth?.id) isLogin();
    }, [auth]);

    useEffect(() => {
        updateToken();
    }, [location.pathname]);

    const updateToken = () => {
        const localToken = localStorage.getItem("token") || null;
        const localAuth = localStorage.getItem("auth") || null;

        if (!localToken || !localAuth) {
            navigate("/login");
        } else if (location.pathname === "/login") {
            navigate("/");
        }

        setToken(localToken);
        setAuth(JSON.parse(localAuth || "{}"));
    };

    const logout = () => {
        localStorage.clear();

        setAuth({});
        setToken(null);

        toast.success("شما با موفقیت خارج شدید");

        updateToken();
    };

    return <AuthContext.Provider value={{ token, auth, updateToken, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

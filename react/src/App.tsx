// src/App.tsx

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes/routes";
import { LoadingProvider } from "@/context/LoadingContext";
import { setLoadingContext } from "@/lib/axios";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import { useLoadingContext } from "@/hooks/useLoadingContext";
import { useEffect, useRef } from "react";

const router = createBrowserRouter(routes);

// کامپوننت برای تنظیم Context در axios
const AxiosSetup = () => {
    const loadingContext = useLoadingContext();
    const isSet = useRef(false);

    useEffect(() => {
        if (loadingContext && !isSet.current) {
            setLoadingContext(loadingContext);
            isSet.current = true;
        }
    }, [loadingContext]);

    return null;
};

export default function App() {
    return (
        <LoadingProvider>
            <AxiosSetup />
            <RouterProvider router={router} />
            <LoadingOverlay />
        </LoadingProvider>
    );
}
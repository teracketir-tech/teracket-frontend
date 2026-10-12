import { findRouteTitle } from "@/lib/utils";
import { routes } from "@/routes/routes";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageTitle() {
    const location = useLocation();

    useEffect(() => {
        const normalized = location.pathname.replace(/\/\d+/g, "/:id");
        const title = findRouteTitle(routes, normalized);

        document.title = `پایگان ( حسابداری ) - ${title}`;
    }, [location.pathname]);
}

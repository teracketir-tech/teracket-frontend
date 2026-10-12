import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Button from "./Button";
import { cn } from "@/lib/utils";
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Filters({
    open,
    setOpen,
    loading,
    children,
    formik,
    onReset,
    onSubmit,
}: {
    open: any;
    setOpen: any;
    loading: boolean;
    children: any;
    formik: any;
    onReset?: () => void;
    onSubmit?: (e: any) => void;
}) {
    const location = useLocation();
    const [useParams, setUseParams] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setUseParams(location.search !== "");
    }, [location.search]);

    const handleReset = () => {
        setOpen(false);
        formik.resetForm();
        setSearchParams({}, { replace: true });

        if (onReset) onReset();
    };

    const handleSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(formik.values).forEach(([key, value]) => {
            if (value) params.set(key, value.toString());
            else params.delete(key);
        });

        params.delete("page");

        setSearchParams(params);

        if (onSubmit) return onSubmit(params);
    };

    return (
        <Card className="w-full py-0! mb-5">
            <CardHeader
                className={cn("cursor-pointer border border-sidebar bg-sidebar pt-4! pb-3!", open ? "rounded-t-xl" : "rounded-xl")}
                onClick={() => setOpen((prev: boolean) => !prev)}
            >
                <CardTitle>
                    <button className={cn("cursor-pointer flex items-center gap-2 text-sm!", useParams ? "text-amber-500!" : "")}>
                        <Filter size={16} />
                        <p>فیلتر ها</p>
                        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </CardTitle>
            </CardHeader>

            <CardContent className={cn("pt-2! transition-transform duration-200", open ? "block" : "hidden")}>{children}</CardContent>

            <CardFooter className={cn("pb-5", open ? "block" : "hidden")}>
                <div className="w-full grid grid-cols-2 gap-5 mt-10">
                    {/* {showReset && ( */}
                    <Button className="h-9.5! bg-transparent! text-[#222529]! border-2 border-[#222529]!" onClick={handleReset}>
                        پاک کردن فیلتر
                    </Button>
                    {/* )} */}
                    <Button className={cn("h-9.5!")} onClick={handleSubmit} isLoading={loading}>
                        جستجو
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

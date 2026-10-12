import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { checkAccess, cn } from "@/lib/utils";
import { PenBox, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Confirm from "@/components/ui/confirm";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import FilterForm from "@/components/pages/unit/Filter";

/** شکلِ یک ردیف در پاسخ `GET hq/unit` — فقط چیزی که فهرست نشان می‌دهد */
interface UnitRow {
    id: number | string;
    name?: string | null;
    company?: { name?: string | null } | null;
}

interface UnitsResponse {
    data?: UnitRow[];
    pages?: number;
}

/**
 * فهرست «واحد» — ایشوی ۷، کپی از پنل seal با ساختارِ فهرستِ خودِ این پنل
 * (همان الگوی `pages/product`).
 *
 * مجوزها: نمایش 912 (همان سمت سرور)، ویرایش 913 و حذف 914.
 */
export default function UnitList() {
    const [searchParams] = useSearchParams();
    const [units, setUnits] = useState<UnitsResponse>({});
    const [loading, setLoading] = useState(true);

    // `useCallback` روی `searchParams` تا افکت فقط هنگامِ تغییرِ فیلتر دوباره
    // اجرا شود؛ setState در callbackِ `.then` می‌آید نه در بدنه‌ی تابع، تا در
    // خودِ افکت صدا نخورده باشد (قاعده‌ی `set-state-in-effect`)
    const fetchUnits = useCallback(() => {
        const query = searchParams.toString();

        return api(`unit?${query ? `${query}&` : ""}expand=company`, "GET").then((res) => {
            setUnits(res ?? {});
            setLoading(false);
        });
    }, [searchParams]);

    const handleDelete = async (id: number | string) => {
        setLoading(true);

        const res = await api(`unit/${id}`, "DELETE");

        if (res?.success) {
            void fetchUnits();
            toast.success("واحد با موفقیت حذف شد.");
        } else {
            setLoading(false);
            toast.error(res?.message || "حذف واحد ممکن نشد.");
        }
    };

    useEffect(() => {
        void fetchUnits();
    }, [fetchUnits]);

    return (
        <div className="w-full">
            <FilterForm loading={loading} />

            <>
                <Title />

                {loading ? (
                    <div className="w-full flex items-center justify-center py-5">
                        <Loading />
                    </div>
                ) : units?.data?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {units?.data?.map((unit, i) => (
                            <div key={unit.id} className="w-full grid grid-cols-5 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{i + 1}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{unit.id}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{unit.name}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{unit?.company?.name ?? "---"}</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-center py-4 gap-3">
                                    {checkAccess([913]) && (
                                        <Link to={`/unit/edit/${unit.id}`} className="cursor-pointer" role="link">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <PenBox className="w-3.5 h-3.5" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>ویرایش</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Link>
                                    )}

                                    {checkAccess([914]) && (
                                        <Confirm title="حذف واحد" onConfirm={() => handleDelete(unit.id)}>
                                            <button className="cursor-pointer">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Trash2Icon className="w-4 h-4 text-red-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>حذف</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </button>
                                        </Confirm>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination totalPage={units.pages ?? 0} />
            </>
        </div>
    );
}

function Title() {
    const list = ["ردیف", "شناسه", "نام", "شرکت", "عملیات"];

    return (
        <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-5">
            {list.map((l: string, i: number) => (
                <div key={i} className={cn("flex items-center justify-center")}>
                    <span className="text-xs font-bold text-[#777777]">{l}</span>
                </div>
            ))}
        </div>
    );
}

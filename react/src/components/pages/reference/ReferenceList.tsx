import { useEffect, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PenBox, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import Confirm from "@/components/ui/confirm";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import Pagination from "@/components/shared/Pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/axios";
import { checkAccess, cn } from "@/lib/utils";
import { EMPTY_FORM_DATA, type FormData } from "./options";

/** یک ردیفِ فهرستِ مرجع — ستون‌های تازه در صورتِ نبود تعریف نشده‌اند */
export interface ReferenceRow {
    id: number | string;
    name: string;
    company_name?: string | null;
    /** گروهِ عددیِ عامل (۱ داخلی / ۲ خارجی) — برچسبش از `form_data` می‌آید */
    factor_group_id?: number | string | null;
    deviation_source?: number | string | null;
    /** شناسه‌های عددیِ اثر غالب از جدولِ رابطه */
    effect_ids?: Array<number | string> | null;
}

/** ستونِ میانیِ فهرست — «ردیف»، «شناسه» و «عملیات» را خودِ فهرست می‌سازد */
export interface ReferenceColumn {
    title: string;
    cell: (row: ReferenceRow) => ReactNode;
}

interface Props {
    /** پیشوندِ endpoint — `daily-report-equipment-type` یا `daily-report-deviation-reason` */
    endpoint: string;
    /** مسیرِ صفحه، برای رفتن به «ویرایش» و بازگشت پس از حذف — دکمه‌ی «افزودن» حذف شد (ایشوی ۱۸) */
    basePath: string;
    /** نامِ نمایشیِ همان لیست در پیام‌ها — «ماشین‌آلات» / «عوامل انحراف» */
    title: string;
    /** ستون‌های میانیِ هر لیست؛ برچسبِ سلکت‌ها را از `form_data` می‌گیرد */
    columns: (formData: FormData) => ReferenceColumn[];
    /** بلاکِ فیلتر؛ شمارنده‌ی بارگذاری و گزینه‌های همان پاسخ را می‌گیرد */
    filter: (loading: boolean, formData: FormData) => ReactNode;
    /**
     * Role of the "edit" button — each list has its own codes (equipment 25xx,
     * deviation 26xx); the daily-report role (2413) must not be used here.
     */
    editRole: number[];
    /** Role of the "delete" button — 2504 for equipment, 2604 for deviation */
    deleteRole: number[];
}

const HEAD = "grid gap-2 px-3 py-3 bg-secondary rounded-t-md text-center";
const CELL = "grid gap-2 items-center px-3 py-2 border-t text-center";

/**
 * فهرستِ یک لیستِ مرجع — الگوی صفحه‌ی «کالاها» (ایشوی ۱۲، گسترشِ ایشوی ۱۵).
 *
 * یک کامپوننتِ پارامتریک برای هر دو موجودیت (نوع ماشین‌آلات و دلیل انحراف)؛
 * کپیِ دومین صفحه ممنوع است (DRY). ستون‌ها و بلاکِ فیلتر از بیرون می‌آیند پس
 * شبکه‌ی grid و عرضِ حداقل از روی همان‌ها ساخته می‌شود (بدون کلاسِ پویا که
 * Tailwind نمی‌سازد). ترتیبِ ردیف‌ها همان `sort_order` سرور است چون همان
 * ترتیب در کشوییِ فرمِ گزارش دیده می‌شود.
 */
export default function ReferenceList({ endpoint, basePath, title, columns, filter, editRole, deleteRole }: Props) {
    const [searchParams] = useSearchParams();
    /**
     * نتیجه‌ی آخرین خواندن. `null` یعنی هنوز چیزی نخوانده‌ایم و همان حالتِ
     * بارگذاری است؛ برای بارگذاریِ بعدی (جستجو/حذف) ردیف‌های قبلی می‌مانند تا
     * صفحه پرش نکند — و `setState` هم مستقیم داخلِ بدنه‌ی افکت زده نشود
     * (قاعدة‌ی `react-hooks/set-state-in-effect`).
     */
    const [data, setData] = useState<{ rows: ReferenceRow[]; pages: number; formData: FormData } | null>(null);
    /** هر حذفی باید فهرست را دوباره بخواند؛ شمارنده به افکت وابستگی می‌دهد */
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const query = searchParams.toString();

        let alive = true;

        api(`${endpoint}${query ? `?${query}` : ""}`)
            .then((res) => {
                if (alive) {
                    setData({ rows: res?.data ?? [], pages: res?.pages ?? 0, formData: res?.form_data ?? EMPTY_FORM_DATA });
                }
            })
            .catch(() => {
                if (alive) setData({ rows: [], pages: 0, formData: EMPTY_FORM_DATA });
            });

        return () => {
            alive = false;
        };
    }, [searchParams, endpoint, tick]);

    const rows = data?.rows ?? [];
    const pages = data?.pages ?? 0;
    const loading = data === null;
    const formData = data?.formData ?? EMPTY_FORM_DATA;
    /** ستون‌ها بسته به `form_data` ساخته می‌شوند تا برچسب سلکت‌ها از سرور بیاید */
    const listColumns = columns(formData);

    const remove = async (id: number | string) => {
        const res = await api(`${endpoint}/${id}`, "DELETE").catch(() => null);

        if (res?.success) {
            toast.success(`${title} حذف شد.`);
            setTick((n) => n + 1);
        } else {
            toast.error(res?.message || "حذف انجام نشد.");
        }
    };

    /** عرضِ ستون‌ها: «ردیف» و «شناسه» ثابت، ستون‌های میانی کشسان، «عملیات» آخر */
    const tracks = ["3.5rem", "5rem", ...listColumns.map(() => "1fr"), "7rem"].join(" ");
    const grid = { gridTemplateColumns: tracks };
    const head = ["ردیف", "شناسه", ...listColumns.map((column) => column.title), "عملیات"];

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <p className="text-sm font-bold">لیست {title}</p>
            </div>

            {filter(loading, formData)}

            <div className="overflow-x-auto">
                <div style={{ minWidth: `${15.5 + listColumns.length * 9}rem` }}>
                    <div className={HEAD} style={grid}>
                        {head.map((label) => (
                            <span key={label} className="text-[0.65rem] font-bold text-[#777777]">
                                {label}
                            </span>
                        ))}
                    </div>

                    {loading ? (
                        <div className="border border-t-0">
                            <Loading />
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="border border-t-0">
                            <Empty text="موردی ثبت نشده است" />
                        </div>
                    ) : (
                        <div className="border border-t-0">
                            {rows.map((row, index) => (
                                <div key={row.id} className={cn(CELL, "hover:bg-gray-50")} style={grid}>
                                    <span className="text-sm">{index + 1}</span>
                                    <span className="text-sm text-[#777777]">{row.id}</span>

                                    {listColumns.map((column) => (
                                        <span key={column.title} className="text-sm break-words">
                                            {column.cell(row)}
                                        </span>
                                    ))}

                                    <span className="flex items-center justify-center gap-3 py-1">
                                        {checkAccess(editRole) && (
                                            <Link to={`${basePath}/edit/${row.id}`} aria-label="ویرایش" className="cursor-pointer">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <PenBox className="w-4 h-4" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>ویرایش</TooltipContent>
                                                </Tooltip>
                                            </Link>
                                        )}

                                        {checkAccess(deleteRole) && (
                                            <Confirm title={`حذف «${row.name}»`} onConfirm={() => remove(row.id)}>
                                                <button className="cursor-pointer text-red-600" aria-label="حذف">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Trash2Icon className="w-4 h-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>حذف</TooltipContent>
                                                    </Tooltip>
                                                </button>
                                            </Confirm>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Pagination totalPage={pages} />
        </div>
    );
}

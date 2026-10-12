import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import ToolTip from "@/components/shared/ToolTip";
import Confirm from "@/components/ui/confirm";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { dateLabel } from "@/lib/labels";
import { REPORT_STATUS, SITE_STATUS } from "@/lib/report-rules";
import { checkAccess } from "@/lib/utils";
import { Eye, PenBox, Trash2Icon } from "lucide-react";

export interface ReportRow {
    id: number | string;
    project_id?: number | string;
    /** ایشوی ۱۸: برای فیلترِ پروژه/شرکتِ صفحه‌ی «نمایش گزارش» */
    company_id?: number | string | null;
    project?: { id?: number | string; name?: string | null } | null;
    report_date?: string | null;
    document_no?: string | null;
    status?: number | string | null;
    site_status?: number | string | null;
}

interface Props {
    rows: ReportRow[];
    loading: boolean;
    /** ایشوی ۱۸ (مورد ۱۱): رفتن به صفحه‌ی «نمایش گزارش» */
    onView: (row: ReportRow) => void;
    onEdit: (row: ReportRow) => void;
    onDelete: (row: ReportRow) => void;
}

const COLUMNS = ["ردیف", "پروژه", "تاریخ گزارش", "شماره مدرک", "وضعیت کارگاه", "وضعیت ثبت", "عملیات"];

/** همان سبک جدول‌های hq: عرض باز، متن وسط، اسکرول افقی در پنجره‌های کوچک */
const GRID = "grid grid-cols-[2.5rem_minmax(9rem,2.5fr)_6rem_5.5rem_5rem_5rem_3.5rem_4rem] gap-x-2";

export default function ReportsTable({ rows, loading, onView, onEdit, onDelete }: Props) {
    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[46rem] flex flex-col">
                <div className={`${GRID} px-1.5 py-4 bg-secondary rounded-t-md`}>
                    {COLUMNS.map((label) => (
                        <div key={label} className="flex items-center justify-center min-w-0">
                            <span className="text-[0.65rem] font-bold text-[#777777] text-center">{label}</span>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="border border-t-0">
                        <Loading />
                    </div>
                ) : rows.length === 0 ? (
                    <div className="border border-t-0">
                        <Empty text="گزارش روزانه‌ای ثبت نشده است" />
                    </div>
                ) : (
                    <div className="flex flex-col border border-t-0">
                        {rows.map((row, index) => (
                            <div key={row.id} className={`${GRID} px-1.5 py-1 border-b hover:bg-gray-50`}>
                                <Cell>{index + 1}</Cell>
                                <TextCell text={row.project?.name || undefined}>{row.project?.name || String(row.project_id ?? "—")}</TextCell>
                                <Cell>{dateLabel(row.report_date)}</Cell>
                                <Cell>{row.document_no || "—"}</Cell>
                                <Cell>{SITE_STATUS[Number(row.site_status)] ?? "—"}</Cell>
                                <Cell>{REPORT_STATUS[Number(row.status)] ?? "—"}</Cell>

                                <div className="flex items-center justify-center py-3 gap-2">
                                    {checkAccess([2412]) && (
                                        <button className="cursor-pointer" onClick={() => onView(row)} aria-label="نمایش">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Eye className="w-3.5 h-3.5" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>نمایش</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </button>
                                    )}

                                    {checkAccess([2413]) && (
                                        <button className="cursor-pointer" onClick={() => onEdit(row)} aria-label="ویرایش">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <PenBox className="w-3.5 h-3.5" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>ویرایش</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </button>
                                    )}

                                    {checkAccess([2414]) && (
                                        <Confirm title="حذف گزارش روزانه" onConfirm={() => onDelete(row)}>
                                            <button className="cursor-pointer" aria-label="حذف">
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
            </div>
        </div>
    );
}

function Cell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center py-3 min-w-0 px-0.5">
            <span className="text-[0.7rem] text-center">{children}</span>
        </div>
    );
}

/** نام پروژه بلند است؛ الیپسیس + تولتیپ عین بقیه‌ی جدول‌های hq */
function TextCell({ children, text }: { children: React.ReactNode; text?: string }) {
    const body = (
        <p className="text-[0.7rem]! text-center truncate" dir="auto">
            {children}
        </p>
    );

    return (
        <div className="flex items-center justify-center py-3 min-w-0 px-0.5">
            <div className="min-w-0 max-w-full">{text ? <ToolTip triger={body} text={text} /> : body}</div>
        </div>
    );
}

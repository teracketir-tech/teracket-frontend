import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import ToolTip from "@/components/shared/ToolTip";
import Confirm from "@/components/ui/confirm";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { dateLabel, durationLabel, slackLabel } from "@/lib/labels";
import { ACTIVITY_STATUS } from "@/lib/report-rules";
import { checkAccess } from "@/lib/utils";
import { PenBox, Trash2Icon } from "lucide-react";
import type { ActivityRow, Num } from "./types";

interface Props {
    rows: ActivityRow[];
    loading: boolean;
    /** واحد پایه‌ی CPM — شناوری آزاد در همین واحد نمایش داده می‌شود */
    baseUnit: Num;
    contactName: (id?: Num) => string;
    /** برچسبِ عوامل انحرافِ چندتاییِ انتخاب‌شده روی ردیف (ایشوی ۴) */
    reasonName: (ids?: (number | string)[]) => string;
    /** پیش‌نمایش گزارش: ستون و دکمه‌های «عملیات» نمایش داده نمی‌شوند */
    readonly?: boolean;
    onEdit: (row: ActivityRow) => void;
    onDelete: (row: ActivityRow) => void;
}

const COLUMNS = [
    "ردیف", "کد فعالیت", "عنوان فعالیت", "مدت", "شروع برنامه", "پایان برنامه", "شناوری آزاد",
    "دیرترین پایان", "پیش‌بینی سرپرست", "مسئول اجرا", "مسئول نظارت", "ساعت",
    "پیشرفت امروز", "پیشرفت تجمعی", "کیفیت", "وضعیت", "دلیل انحراف", "عملیات",
];

/**
 * ۱۸ ستون با عرضِ باز (عین جدول تسک‌های فاز ۱) و اسکرول افقی در پنجره‌های کوچک؛
 * ستون‌های برنامه‌ای از snapshotِ خودِ ردیف می‌آیند نه از ورودی ناظر (بند ۱۶).
 *
 * عرض‌ها یک‌جا نوشته می‌شوند تا «پیش‌نمایش» همان جدول را بدون ستون «عملیات»
 * داشته باشد (کلاس Tailwindِ تولیدشده از داده را نمی‌بیند، پس inline ست می‌شود).
 */
const TRACKS = "1.75rem minmax(4rem,0.9fr) minmax(9rem,2.5fr) 4.5rem 5rem 5rem 4.5rem 5rem 5rem 5.5rem 5.5rem 3.5rem 4rem 4rem 3.5rem 4.5rem 6rem";
const GRID = "grid gap-x-2";
const gridStyle = (readonly: boolean) => ({ gridTemplateColumns: readonly ? TRACKS : `${TRACKS} 4rem` });

export default function ActivitiesTable({
    rows,
    loading,
    baseUnit,
    contactName,
    reasonName,
    readonly = false,
    onEdit,
    onDelete,
}: Props) {
    const columns = readonly ? COLUMNS.filter((label) => label !== "عملیات") : COLUMNS;

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[92rem] flex flex-col">
                <div className={`${GRID} px-1.5 py-4 bg-secondary rounded-t-md`} style={gridStyle(readonly)}>
                    {columns.map((label) => (
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
                        <Empty text="هنوز فعالیتی به این گزارش اضافه نشده است" />
                    </div>
                ) : (
                    <div className="flex flex-col border border-t-0">
                        {rows.map((row, index) => (
                            <ActivityRowCell
                                key={row.id}
                                row={row}
                                index={index}
                                baseUnit={baseUnit}
                                contactName={contactName}
                                reasonName={reasonName}
                                readonly={readonly}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

interface RowProps {
    row: ActivityRow;
    index: number;
    baseUnit: Num;
    contactName: (id?: Num) => string;
    reasonName: (ids?: (number | string)[]) => string;
    readonly: boolean;
    onEdit: (row: ActivityRow) => void;
    onDelete: (row: ActivityRow) => void;
}

function ActivityRowCell({ row, index, baseUnit, contactName, reasonName, readonly, onEdit, onDelete }: RowProps) {
    return (
        <div className={`${GRID} px-1.5 py-1 border-b hover:bg-gray-50`} style={gridStyle(readonly)}>
            <Cell>{index + 1}</Cell>
            <Cell>{row.wbs_code || "—"}</Cell>
            <TextCell text={row.task_name || undefined}>{row.task_name || "—"}</TextCell>

            <Cell>{durationLabel(row.duration_value, row.duration_unit)}</Cell>
            <Cell>{dateLabel(row.planned_start)}</Cell>
            <Cell>{dateLabel(row.planned_finish)}</Cell>
            <Cell>{slackLabel(row.free_float, baseUnit)}</Cell>
            <Cell>{dateLabel(row.latest_finish)}</Cell>
            <Cell>{dateLabel(row.supervisor_forecast_date)}</Cell>
            <TextCell text={contactName(row.executor_id)}>{contactName(row.executor_id)}</TextCell>
            <TextCell text={contactName(row.supervisor_id)}>{contactName(row.supervisor_id)}</TextCell>

            <Cell>{numberCell(row.work_hours)}</Cell>
            <Cell>{percentCell(row.daily_progress)}</Cell>
            <Cell>{percentCell(row.cumulative_progress)}</Cell>
            <Cell>{percentCell(row.quality_percent)}</Cell>
            <Cell>{ACTIVITY_STATUS[Number(row.status)] ?? "—"}</Cell>
            <TextCell text={reasonName(row.deviation_reason_ids)}>{reasonName(row.deviation_reason_ids)}</TextCell>

            {!readonly && (
                <div className="flex items-center justify-center py-3 gap-2">
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
                        <Confirm title="حذف فعالیت" onConfirm={() => onDelete(row)}>
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
            )}
        </div>
    );
}

const isBlank = (value?: Num) => value === null || value === undefined || value === "";

const percentCell = (value?: Num) => (isBlank(value) ? "—" : `${Number(value).toLocaleString()}%`);

const numberCell = (value?: Num) => (isBlank(value) ? "—" : Number(value).toLocaleString());

function Cell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center py-3 min-w-0">
            <span className="text-[0.7rem] text-center">{children}</span>
        </div>
    );
}

/** نامِ اشخاص بلند است؛ الیپسیس + تولتیپ عین ستون‌های متنی جدول تسک‌ها */
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

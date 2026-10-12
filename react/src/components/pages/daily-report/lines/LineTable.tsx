import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import ToolTip from "@/components/shared/ToolTip";
import Confirm from "@/components/ui/confirm";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { checkAccess } from "@/lib/utils";
import { PenBox, Trash2Icon, Undo2Icon } from "lucide-react";
import { cellText, type Labeler } from "./cells";
import type { LineConfig, LineRow } from "./types";

interface Props {
    config: LineConfig;
    rows: LineRow[];
    loading: boolean;
    label: Labeler;
    /** پیش‌نمایش: ستون و دکمه‌های «عملیات» حذف می‌شوند */
    readonly?: boolean;
    onEdit?: (row: LineRow) => void;
    onDelete?: (row: LineRow) => void;
}

/** ستونِ «عملیات» فقط در حالت عادی جدول است؛ پیش‌نمایش ستونِ اضافه ندارد */
const gridTemplate = (config: LineConfig, readonly: boolean) =>
    config.columns.map((column) => column.w).join(" ") + (readonly ? "" : " 4rem");

/**
 * جدولِ مشترکِ پنج زیرمجموعه — ستون‌ها از `config.ts` می‌آیند.
 *
 * عرض‌ها داخلِ پیکربندی‌اند پس `grid-template-columns` به‌صورت inline ست می‌شود
 * (Tailwind کلاسِ تولیدشده از داده را نمی‌بیند). اسکرول افقی در پنجره‌های
 * کوچک همانند جدول فعالیت‌هاست.
 */
export default function LineTable({ config, rows, loading, label, readonly = false, onEdit, onDelete }: Props) {
    const template = gridTemplate(config, readonly);

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex flex-col" style={{ minWidth: config.minWidth }}>
                <div className="grid gap-x-2 px-1.5 py-4 bg-secondary rounded-t-md" style={{ gridTemplateColumns: template }}>
                    {config.columns.map((column) => (
                        <div key={column.key} className="flex items-center justify-center min-w-0">
                            <span className="text-[0.65rem] font-bold text-[#777777] text-center">{column.title}</span>
                        </div>
                    ))}

                    {!readonly && (
                        <div className="flex items-center justify-center min-w-0">
                            <span className="text-[0.65rem] font-bold text-[#777777] text-center">عملیات</span>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="border border-t-0">
                        <Loading />
                    </div>
                ) : rows.length === 0 ? (
                    <div className="border border-t-0">
                        <Empty text={`هنوز ردیفی برای «${config.title}» ثبت نشده است`} />
                    </div>
                ) : (
                    <div className="flex flex-col border border-t-0">
                        {rows.map((row, index) => (
                            <LineRowCell
                                key={row.id}
                                config={config}
                                row={row}
                                index={index}
                                label={label}
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
    config: LineConfig;
    row: LineRow;
    index: number;
    label: Labeler;
    readonly: boolean;
    onEdit?: (row: LineRow) => void;
    onDelete?: (row: LineRow) => void;
}

function LineRowCell({ config, row, index, label, readonly, onEdit, onDelete }: RowProps) {
    const template = gridTemplate(config, readonly);

    return (
        <div className="grid gap-x-2 px-1.5 py-1 border-b hover:bg-gray-50" style={{ gridTemplateColumns: template }}>
            {config.columns.map((column) => (
                <Cell key={column.key} text={cellText(column, row, label, index)} />
            ))}

            {!readonly && (
                <div className="flex items-center justify-center py-3 gap-2">
                    {checkAccess([2413]) && onEdit && (
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

                    {checkAccess([2414]) && onDelete && (
                        /**
                         * Feedback 1: a timesheet is not "deleted", it is "released".
                         * Both the icon and the text change so the user knows the
                         * device row survives and merely stopped belonging to this
                         * activity.
                         */
                        <Confirm title={`${config.release ? "آزادسازی" : "حذف"} ${config.entity}`} onConfirm={() => onDelete(row)}>
                            <button className="cursor-pointer" aria-label={config.release ? "آزادسازی" : "حذف"}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {config.release ? <Undo2Icon className="w-4 h-4 text-red-500" /> : <Trash2Icon className="w-4 h-4 text-red-500" />}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{config.release ? "آزادسازی" : "حذف"}</p>
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

/** نام اشخاص/کالاها بلند است؛ الیپسیس + تولتیپ عین بقیه‌ی جدول‌های hq */
function Cell({ text }: { text: string }) {
    return (
        <div className="flex items-center justify-center py-3 min-w-0 px-0.5">
            <div className="min-w-0 max-w-full">
                <ToolTip triger={<p className="text-[0.7rem]! text-center truncate" dir="auto">{text}</p>} text={text} />
            </div>
        </div>
    );
}

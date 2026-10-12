import { useState } from "react";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import { dateLabel } from "@/lib/labels";
import { POSITION } from "@/lib/positions";
import type { LogRow } from "./useTimesheetLogs";

const ghostButton =
    "h-10 px-5 rounded border border-secondary bg-white text-foreground text-sm transition-all hover:bg-secondary disabled:opacity-50 cursor-pointer";

const timeOf = (value: unknown) => {
    const text = String(value ?? "");
    return text ? text.slice(text.indexOf(" ") + 1, text.indexOf(" ") + 6) : "—";
};

const positionOf = (value: unknown) => POSITION[Number(value)] ?? "—";

interface Props {
    open: boolean;
    onClose: () => void;
    /** `report_date` (ISO) — shown in the title as a Shamsi date */
    reportDate: string;
    rows: LogRow[];
    loading: boolean;
    saving: boolean;
    onConfirm: (ids: (number | string)[]) => Promise<boolean>;
}

/**
 * Multi-select over the fingerprint rows of the report day (issue 1.2).
 *
 * An empty list is the normal state for a day the device did not record: the
 * panel then offers manual entry instead (issue 1.3), which is why this dialog
 * says so rather than looking broken.
 */
export default function LogPicker({ open, onClose, reportDate, rows, loading, saving, onConfirm }: Props) {
    const [picked, setPicked] = useState<(number | string)[]>([]);

    /**
     * Reset lives in the close handler, not in an effect (the `set-state-in-
     * effect` rule): a stale selection would silently stamp rows the
     * supervisor no longer sees on the next opening.
     */
    const close = () => {
        setPicked([]);
        onClose();
    };

    const has = (id: number | string) => picked.includes(id);

    const toggle = (id: number | string) =>
        setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

    const all = rows.length > 0 && picked.length === rows.length;

    const toggleAll = () => setPicked(all ? [] : rows.map((row) => row.id));

    const confirm = async () => {
        if (await onConfirm(picked)) close();
    };

    return (
        <Modal title={`رکوردهای حضور و غیاب — ${reportDate ? dateLabel(reportDate) : "بدون تاریخ"}`} open={open} setOpen={(value) => !value && close()} className="w-11/12 sm:max-w-3xl">
            <div className="flex flex-col gap-4">
                {loading ? (
                    <Loading />
                ) : rows.length === 0 ? (
                    <Empty text="برای این تاریخ رکوردی در دستگاه ثبت نشده است؛ می‌توانید ردیف را دستی اضافه کنید." />
                ) : (
                    <div className="flex max-h-[58vh] flex-col overflow-y-auto">
                        <label className="flex items-center gap-2 bg-secondary px-2 py-2 text-xs font-bold">
                            <input type="checkbox" checked={all} onChange={toggleAll} className="cursor-pointer" />
                            انتخاب همه ({rows.length} رکورد)
                        </label>

                        {rows.map((row) => (
                            <label key={row.id} className="flex cursor-pointer items-center gap-2 border-b px-2 py-2 text-[0.75rem] hover:bg-gray-50">
                                <input type="checkbox" checked={has(row.id)} onChange={() => toggle(row.id)} />
                                <span className="min-w-0 flex-1 truncate" dir="auto">
                                    {row.person_name || row.user_id}
                                </span>
                                <span className="w-24 shrink-0 text-[#777777]">{positionOf(row.person_position)}</span>
                                <span className="w-16 shrink-0" dir="ltr">
                                    {timeOf(row.checkindate)}
                                </span>
                                <span className="w-16 shrink-0" dir="ltr">
                                    {timeOf(row.checkout_date)}
                                </span>
                            </label>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 border-t pt-3">
                    <button type="button" className={ghostButton} onClick={close}>
                        انصراف
                    </button>
                    <div className="w-48">
                        <Button onClick={confirm} isLoading={saving} disabled={loading || picked.length === 0}>
                            افزودن انتخاب‌شده‌ها ({picked.length})
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

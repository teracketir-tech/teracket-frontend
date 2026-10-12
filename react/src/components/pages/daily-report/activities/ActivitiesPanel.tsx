import { useEffect, useState } from "react";
import Button from "@/components/shared/Button";
import Notice from "../Notice";
import ActivityForm from "./ActivityForm";
import ActivitiesTable from "./ActivitiesTable";
import useActivities from "./useActivities";
import { emptyActivity, toValues } from "./values";
import type { ActivityRow, ActivityValues } from "./types";

interface Props {
    formik: { values: Record<string, string> };
    /** شناسه‌ی گزارش ذخیره‌شده در تبِ سربرگ */
    reportId: number | null;
    locked?: boolean;
    /**
     * بند ۳: شمارشِ فعالیت‌ها (و اینکه هنوز در حال بارگذاری است) به صفحه‌ی
     * فرم می‌رود تا رفتنِ مستقیم به «پیش‌نمایشِ» خالی مسدود شود. صفحه باید
     * مقدارِ تکراری را نادیده بگیرد تا حلقه‌ی رندر ساخته نشود.
     */
    onActivitiesChange?: (count: number, loading: boolean) => void;
}

/**
 * تب «فعالیت‌ها» — سند فاز ۲ بندهای ۴، ۵ و ۱۶.
 *
 * ردیف‌ها همان لحظه روی سرور می‌نشینند (POST تو در تو یا PATCH) چون endpoint
 * جداگانه دارند؛ بنابراین جابه‌جایی بین تب‌ها هیچ ورودی‌ای را از بین نمی‌برد.
 */
export default function ActivitiesPanel({ formik, reportId, locked = false, onActivitiesChange }: Props) {
    const projectId = formik.values.project_id;
    /** شرکتِ سربرگ (ایشوی ۱) — اشخاص و واژه‌نامه‌ی این تب و زیرمجموعه‌ها */
    const companyId = formik.values.company_id ?? "";
    /**
     * The header `report_date` in Gregorian (ISO) — exactly what
     * `formatDateToEn` writes. The timesheet tab reads the day's attendance
     * machine log with this very date (issue 1.2).
     */
    const reportDate = formik.values.report_date ?? "";

    const { tasks, rows, contacts, baseUnit, contactName, deviationReasons, reasonName, loading, saving, save, remove } =
        useActivities({
            reportId,
            projectId,
            companyId,
            /** ایشوی ۳: فقط فعالیت‌های همین روز لیست می‌شوند */
            reportDate,
        });

    const [open, setOpen] = useState(false);
    const [initial, setInitial] = useState<ActivityValues | null>(null);

    // بند ۳ — قبل از هر return زودهنگام تا حتی در حالتِ «خبربرگ هنوز ذخیره نشده»
    // هم صفحه بداند فعالیتی در کار نیست
    useEffect(() => {
        onActivitiesChange?.(rows.length, loading);
    }, [rows.length, loading, onActivitiesChange]);

    if (!reportId) {
        return <Notice text="ابتدا سربرگ گزارش را ذخیره کنید تا امکان ثبت فعالیت فراهم شود." />;
    }

    if (!projectId) {
        return <Notice text="در سربرگ، پروژه را انتخاب کنید تا Taskهای قابل گزارش لیست شوند." />;
    }

    if (!reportDate) {
        return <Notice text="در سربرگ، تاریخ گزارش را وارد کنید تا فعالیت‌های برنامه‌ریزی‌شده نمایش داده شوند." />;
    }

    const add = () => {
        setInitial(emptyActivity());
        setOpen(true);
    };

    const edit = (row: ActivityRow) => {
        setInitial(toValues(row));
        setOpen(true);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">فعالیت‌های انجام شده</p>
                    <p className="text-xs text-[#777777]">هر ردیف یعنی عملکرد یک Task از WBS در همین گزارش روزانه</p>
                </div>

                <div className="w-48">
                    <Button onClick={add} disabled={locked || tasks.length === 0}>
                        افزودن فعالیت
                    </Button>
                </div>
            </div>

            {tasks.length === 0 && (
                <Notice text="برای این روز فعالیتی قابلِ گزارش نیست: یا برای این پروژه Taskی ثبت نشده، یا هیچ فعالیتی در تاریخِ گزارش برنامه‌ریزی نشده است." />
            )}

            <ActivitiesTable
                rows={rows}
                loading={loading}
                baseUnit={baseUnit}
                contactName={contactName}
                reasonName={reasonName}
                readonly={locked}
                onEdit={edit}
                onDelete={(row: ActivityRow) => remove(row.id)}
            />

            <ActivityForm
                open={open}
                onClose={() => setOpen(false)}
                reportId={reportId}
                projectId={projectId}
                companyId={companyId}
                reportDate={reportDate}
                tasks={tasks}
                rows={rows}
                contacts={contacts}
                baseUnit={baseUnit}
                initial={initial}
                saving={saving}
                locked={locked}
                deviationReasons={deviationReasons}
                onSave={save}
            />
        </div>
    );
}

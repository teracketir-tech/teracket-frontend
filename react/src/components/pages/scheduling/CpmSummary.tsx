import { criticalBadge } from "./options";
import { unitLabel } from "@/lib/labels";
import { Fragment } from "react";

interface Props {
    /** کلید `cpm` پاسخ لیست تسک‌ها؛ در نبودِ پروژه‌ی انتخاب‌شده وجود ندارد */
    cpm: any;
}

/**
 * نوار خلاصه‌ی زمان‌بندی بالای جدول — جایگزین مودال CPM.
 * طول پروژه، تعداد تسک‌ها، تعداد فعالیت‌های بحرانی و نام فعالیت‌های مسیر بحرانی.
 */
export default function CpmSummary({ cpm }: Props) {
    if (!cpm) return null;

    if (!cpm.success) {
        return (
            <div className="w-full mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">{cpm.message || "محاسبه مسیر بحرانی ممکن نشد"}</div>
        );
    }

    /** `critical_path` شناسه‌ها را می‌دهد؛ نام‌ها در `critical_tasks` است */
    const criticalTasks: any[] = cpm.critical_tasks ?? [];

    return (
        <div className="w-full mb-4 flex flex-col gap-3 rounded border border-[#dddddd] p-4">
            <div className="grid grid-cols-3 gap-3">
                <Summary label="طول پروژه" value={`${Number(cpm.project_duration || 0).toLocaleString()} ${unitLabel(cpm.unit)}`} />
                <Summary label="تعداد تسک" value={Number(cpm.task_count ?? 0).toLocaleString()} />
                {/* عدد تعدادِ فعالیت‌های برگِ بحرانی است، نه بزرگی زمانی (طول مسیر بحرانی همیشه = طول پروژه) */}
                <Summary label="تعداد فعالیت بحرانی" value={String((cpm.critical_path ?? []).length)} />
            </div>

            <div className="rounded border border-[#dddddd] p-3">
                <p className="text-xs font-bold text-[#777777] mb-1">مسیر بحرانی</p>
                {/* هر فعالیت در بج خودش؛ فلش‌های `←` همان‌های قبلی‌اند */}
                <p className="text-xs leading-6 flex flex-wrap items-center gap-1.5">
                    {criticalTasks.length === 0 && <span>—</span>}
                    {criticalTasks.map((task: any, index: number) => (
                        <Fragment key={String(task.id ?? index)}>
                            {index > 0 && <span>←</span>}
                            {/* رنگ متن از ظرف ارث‌بری می‌شود ⇒ مشکی، هم‌رنگ فلش‌ها */}
                            <span className={criticalBadge}>{task.name}</span>
                        </Fragment>
                    ))}
                </p>
            </div>
        </div>
    );
}

function Summary({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded border border-[#dddddd] p-3 flex flex-col gap-1">
            <span className="text-[0.7rem] text-[#777777]">{label}</span>
            <span className="text-sm font-bold">{value}</span>
        </div>
    );
}

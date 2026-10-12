import type { ActivityRow, ActivityValues } from "./types";

/**
 * نگاشت مقادیر دیالوگِ فعالیت ↔ payload سرور — ایشوی ۱۲ از `types.ts` جدا شد
 * تا آن فایل فقط «نوع» بماند و سقفِ ۱۵۰ خطیِ فایلِ تایپ رعایت شود.
 *
 * ایشوی ۳ و ۴: «پیمانکار» به فیلدهای فعالیت آمد (ستونِ مدل) و «عوامل انحراف»
 * از تبِ جدا به مالتیِ همان فرم رفت؛ دومی چون ستونِ تکی نیست به‌صورت آرایه‌ای
 * جدا در payload می‌نشیند و سرور همان را با `sync` در جدول رابطه می‌نویسد.
 */

/** ستون‌های واقعیِ قابل ویرایش — بقیه در payload نمی‌روند */
export const EDITABLE_KEYS = [
    "task_id",
    "supervisor_forecast_date",
    "executor_id",
    "supervisor_id",
    "contractor_id",
    "work_hours",
    "daily_progress",
    "quality_percent",
    "status",
    "description",
    "risks",
] as const;

/** فقط همین فیلدها به سرور فرستاده می‌شوند (snapshot و تجمعی مالِ Backend است) */
export function pickEditable(values: ActivityValues): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    EDITABLE_KEYS.forEach((key) => {
        payload[key] = values[key] ?? "";
    });

    // خارج از EDITABLE_KEYS چون ستونِ مدل نیست؛ سرور همین کلید را می‌خواند
    payload.deviation_reason_ids = values.deviation_reason_ids ?? [];

    return payload;
}

/** ردیف خالیِ دیالوگِ «افزودن» — صفرها عمداً صریح‌اند چون Input عددی نمایشِ خالی ندارد */
export function emptyActivity(taskId: number | string = ""): ActivityValues {
    return {
        id: "",
        task_id: taskId,
        work_hours: "0",
        daily_progress: "0",
        quality_percent: "0",
        status: "",
        supervisor_forecast_date: "",
        executor_id: "",
        supervisor_id: "",
        contractor_id: "",
        description: "",
        risks: "",
        deviation_reason_ids: [],
    };
}

/**
 * بند ۸: ستون‌های decimal سرور «۰٫۰۰» برمی‌گردانند؛ فیلدِ عددیِ فرم باید صرفِ
 * صفرِ ساده ببیند. `String(Number(...))` هم اعشارِ بی‌معنی (۸٫۰۰) را حذف می‌کند
 * و هم اعشارِ واقعی (۸٫۵) را نگه می‌‌دارد.
 */
function hoursValue(value: unknown): string {
    const number = Number(value);
    return value === null || value === undefined || value === "" || Number.isNaN(number) ? "0" : String(number);
}

/** ردیف خوانده‌شده از سرور → مقادیر دیالوگ */
export function toValues(row: ActivityRow): ActivityValues {
    return {
        ...emptyActivity(),
        ...row,
        id: row.id,
        task_id: row.task_id,
        work_hours: hoursValue(row.work_hours),
        daily_progress: row.daily_progress ?? "0",
        quality_percent: row.quality_percent ?? "0",
        status: row.status ?? "",
        supervisor_forecast_date: row.supervisor_forecast_date ?? "",
        executor_id: row.executor_id ?? "",
        supervisor_id: row.supervisor_id ?? "",
        contractor_id: row.contractor_id ?? "",
        description: row.description ?? "",
        risks: row.risks ?? "",
        deviation_reason_ids: row.deviation_reason_ids ?? [],
    };
}
